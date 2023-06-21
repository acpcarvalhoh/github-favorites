import { GitHubUser } from "./github.user.js"

// classe que contem a lógica dos dados
export class Favorites{
   constructor(root){
    this.root = document.querySelector(root)

     this.load()
   }



   load(){
        this.users = JSON.parse(localStorage.getItem('@github-user:')) || []
    }


    save(){
        localStorage.setItem('@github-user:', JSON.stringify(this.users))
    }


    async add(username){
        try {
            const userExiste = this.users.find(enter => enter.login  === username)

            if(userExiste){
                throw new Error("Usuário já cadastrado!")
            }


            const githubUser = await GitHubUser.search(username)

            if(githubUser.login === undefined){
                throw new Error("Usuário não encontrado")
            }

            this.users = [githubUser, ...this.users]
            this.update()
            this.save()

        } catch (error) {
            alert(error.message)
        }
    }

    delete(user) {
        this.users = this.users.filter(enter => {
            return enter.login !== user.login;
        });


        this.update()
        this.save()
    }
    
}



// classe que vai criar a vizualização do HTML
export class FavoritesView extends Favorites{
    constructor(root){
        super(root)

        this.tbody = this.root.querySelector('table tbody')

        this.update()
        this.onadd()
        
    }

    onadd(){
        const addButton = this.root.querySelector('.add-favorite')

        addButton.onclick = () =>{
            console.log('clicado')

            const {value} = this.root.querySelector('.search #github-user')

            this.add(value)
        }


        const imgStar = this.root.querySelector('.add-favorite img');
        addButton.onmouseover = () => {
            imgStar.src = 'assets/star-blue.svg';
        };

        addButton.onmouseout = () => {
            imgStar.src = 'assets/star.svg';
        };



    }


    update(){
        this.removeAlltr()
       
        this.emptyRow()

        this.users.forEach(user => {
            const row = this.createRow()

            row.querySelector('.users img').src = `https://github.com/${user.login}.png`
            row.querySelector('.users img').alt = `Imagem de ${user.name}`
            row.querySelector('.users a').href = `https://github.com/${user.login}`
            row.querySelector('.users a p').textContent = user.name
            row.querySelector('.users a span').textContent = user.login
            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.folowers').textContent = user.followers

            row.querySelector('.remove').onclick = () => {
                const isOK = confirm("Tem certeza que quer remover esse favorito?");
                if (isOK) {
                    this.delete(user);
                }
            };
            

            this.tbody.append(row)

        })
    }


    createRow(){
        const tr = document.createElement('tr')

        tr.innerHTML = `
        
            <td class="users">
                <div class="user">
                    <img src="https://github.com/acpcarvalhoh.png" alt="imagem do Adão">
                    <a href="https://github.com/acpcarvalhoh" target="_blank">
                        <p>Adão Carvalho</p>
                        <span>/acpcarvalhoh</span>
                    </a>
                </div>
            </td>

            <td class="repositories">
                21
            </td>

            <td class="folowers">
                5
            </td>
            
            <td>
                <button class="remove">Remover</button>
            </td>
        
        `

        return tr

    }

    emptyRow(){
        if (this.users.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `
                <td colspan="4">
                    <div class="empty-fav">
                        <img src="assets/Estrela.svg" alt="imagem de estrela">
                        <h2>Nenhum favorito ainda</h2>
                    </div>
                </td>
            `;


            this.tbody.append(emptyRow);
        }
    }

    removeAlltr(){
        

        this.tbody.querySelectorAll('tr').forEach((tr) => {
            tr.remove()
        });
    }
}
