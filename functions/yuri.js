/** @type {<Type>(arr: Type[]) => Type} */
const random = arr => arr[Math.floor(Math.random() * arr.length)]
const pictures = [
  "/yurifolder/1.jpg"
]
export function onRequest (context) {
  return Response.redirect(random(pictures), 307);
}