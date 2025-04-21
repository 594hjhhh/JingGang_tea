class CultureNavigator extends HTMLElement {  
    constructor() {  
        super();  

        // 初始化 Shadow DOM  
        this.attachShadow({ mode: 'open' });  
        this.shadowRoot.innerHTML = `  
        <style>  
            /* 导航栏样式 */  
            .navbar {  
                width: 100%;  
                background-image: url("../imges/backgroundpicture/绿4.jpg");
                color: white;  
                height: 90px;  
                line-height: 90px;  
            }  
            .navbar-container {  
                max-width: 1550px;  
                width: 90%;  
                margin: 0 auto;  
                display: flex;  
                justify-content: flex-end;  
                align-items: center;  
            }  
            .navbar-title {  
                font-family: 'm1Font';  
                font-size: 28px;  
                color: white;  
                margin-left: 30px;  
                text-decoration: none;  
                cursor: pointer;  
                transition: color 0.3s ease;  
            }  
            .navbar-title:hover {  
                color: #2c4a3e;  
            }  
            .navbar-toggle {  
                display: none;  
            }  
            @media (max-width: 768px) {  
                .navbar-container {  
                    display: flex;  
                    flex-wrap: wrap;  
                }  
                .navbar-title {  
                    font-size: 1.2rem;  
                    margin-left: 10px;  
                }  
            }  
        </style>  
        <div class="navbar">  
            <div class="navbar-container"></div>  
        </div>  
        `;  

        const links = [  
            { href: "./Jinggang_culture.html", title: "茗韵流芳" },  
            { href: "./time.html", title: "翠绿渊源" },  
            { href: "./tea_making.html", title: "制茗匠心" }  
        ];  

        // 动态生成导航项  
        const navbarContainer = this.shadowRoot.querySelector('.navbar-container');  
        links.forEach(link => {  
            const a = document.createElement('a');  
            a.href = link.href;  
            a.textContent = link.title;  
            a.className = 'navbar-title'; 
            a.target="_blank" ;
            navbarContainer.appendChild(a);  
        });  
    }  
}  

// 注册自定义元素  
if (!customElements.get('culture-navigator')) {  
    customElements.define('culture-navigator', CultureNavigator);  
}  