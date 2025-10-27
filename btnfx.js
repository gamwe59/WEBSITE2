const wrapper = document.getElementById("wrapper")

console.log("faggot")
Array.from(document.getElementsByClassName("butt")).forEach( (e) => {
    let startEffect = (ev) => {
        let yP = 1 - (ev.offsetY / 31) * 2
        let xP = -1 + (ev.offsetX / 88) * 2
        e.style.transform =
            "scale(115%)" +
            ` rotate3d(${yP.toFixed(2)}, ${xP.toFixed(2)},0,20deg)` +
            ` translate(${3 * xP}px,${-5 * yP}px)`
        e.style.boxShadow = `${(-3 * xP).toFixed(2)}px ${(5 * yP).toFixed(2)}px 15px black`
        e.style.transitionDuration = "0.1s";
    }
    e.addEventListener("mouseover", startEffect)
    e.addEventListener("mousemove", startEffect)
    e.addEventListener("mouseleave", () => {
        e.style.transform = "";
        e.style.boxShadow = "";
        e.style.transitionDuration = "0.3s";
    })
})