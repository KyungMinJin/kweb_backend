const contentFront = () => {
    emptyContent();
    document.getElementById("front").style.display = "block";
};
const contentTag = () => {
    emptyContent();
    document.getElementById("tag").style.display = "block";
};
const contentRandom = () => {
    emptyContent();
    document.getElementById("random").style.display = "block";
};
const emptyContent = () => {
    const contents = document.getElementsByClassName("content");
    for(let i = 0;i<contents.length;i++){
        contents[i].style.display = "none";
    }
};