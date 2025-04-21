// 静态图片路径列表  
window.onload = function () {   
  const imgList = [  
    "../imges/shuhua/陈字绘 人物故事册之一.jpg",  
    "../imges/shuhua/仇英绘 竹园品古图页.jpg",  
    "../imges/shuhua/春宴图.jpg",  
    "../imges/shuhua/丁观鹏绘 西园雅集图轴.jpg",  
    "../imges/shuhua/董邦达绘 钱陈群书 荷露烹茶诗成扇.jpg",  
    "../imges/shuhua/董邦达西苑千尺雪图卷.jpg",  
    "../imges/shuhua/杜堇绘 古贤诗意图卷.jpg",  
    "../imges/shuhua/弘历绘 竹炉山房图轴.jpg",  
    "../imges/shuhua/黄庭坚书 奉同公择尚书咏茶碾煎啜三首.webp",  
    "../imges/shuhua/金士松书 弘历品茶诗册.jpg",  
    "../imges/shuhua/彭元瑞书 弘历《寒山千尺雪》诗册.jpg",  
    "../imges/shuhua/唐寅绘 事茗图卷.jpg",  
    "../imges/shuhua/停办贡茶碑拓片.jpg",  
    "../imges/shuhua/托盏侍女图.jpg",  
    "../imges/shuhua/文徵明绘 茶具十咏图轴.jpg",  
    "../imges/shuhua/佚名绘 弘历观月图轴.jpg",  
    "../imges/shuhua/佚名绘 清明上河图卷.jpg",  
    "../imges/shuhua/张宏绘 试茗扇页.jpg"  
  ];  
  
  // 每个图片对应的目标网页链接列表  
  const linkList = [  
    "../html/detail/人物故事册之一.html",  
    "../html/detail/竹园品古图页.html",  
    "../html/detail/春宴图.html",  
    "../html/detail/西园雅集图轴.html",  
    "../html/detail/荷露烹茶诗成扇.html",  
    "../html/detail/董邦达西苑千尺雪图卷.html",   
    "../html/detail/古贤诗意图卷.html",   
    "../html/detail/竹炉山房图轴.html",  
    "../html/detail/奉同公择尚书咏茶碾煎啜三首.html",  
    "../html/detail/弘历品茶诗册.html",  
    "../html/detail/弘历《寒山千尺雪》诗册.html",  
    "../html/detail/事茗图卷.html",  
    "../html/detail/停办贡茶碑拓片.html",  
    "../html/detail/托盏侍女图.html",  
    "../html/detail/茶具十咏图轴.html",  
    "../html/detail/弘历观月图轴.html",  
    "../html/detail/清明上河图卷.html",  
    "../html/detail/试茗扇页.html"  
  ];  

  // 获取容器  
  const container = document.getElementById("waterfallContainer");  

  if (!container) {  
    console.error("未找到容器元素，请检查 HTML 中是否存在 id 为 'waterfallContainer' 的 div。");  
    return;  
  }  

  // 动态生成图片元素并插入到容器中  
  imgList.forEach((img, index) => {  // 通过声明 index 获取当前循环的索引  
    const imageBox = document.createElement("div");  
    imageBox.className = "image-box";  

    // 创建链接元素  
    const link = document.createElement("a");  
    link.href = linkList[index]; // 使用 linkList 中对应索引的链接  
    link.target = "_blank"; // 在新标签页打开链接  

    // 创建图片元素  
    const image = document.createElement("img");  
    image.src = img;  
    image.alt = "";  

    // 提取文件名作为标题  
    const fileName = img.split('/').pop().split('.')[0]; // 获取文件名（去掉路径和扩展名）  
    const title = document.createElement("div");  
    title.className = "title";  
    title.textContent = fileName;  

    // 将图片放入链接中  
    link.appendChild(image);   

    // 将链接和标题添加到盒子中  
    imageBox.appendChild(link);  
    imageBox.appendChild(title);  

    // 将盒子添加到容器中  
    container.appendChild(imageBox);  
  });   
};  