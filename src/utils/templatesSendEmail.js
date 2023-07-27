export function templateConfirmAccont(data) {
  return `
  <div
  style="
    background-color: rgb(255, 254, 254);
    width: 100%;
    height: 400px;
    border-radius: 8px;
    margin-left: 5px;
    font-family: Georgia, 'Times New Roman', Times, serif;
    color: rgba(0, 0, 0, 0.671);
  "
>
  <h3 style="color: black; font-size: 25px;">Hola ${data.name} ${data.lastname} </h3>
  <p style="margin-top: 50px; margin-bottom: 30px;font-size: 18px;">
    Para confirmar tu cuenta debes de dar click en el botón de abajo.
  </p>
  <a
    href=${data.link} style="
      text-decoration: none;
      color: white;
      background-color: rgba(0, 0, 255, 0.63);
      font-size: 18px;
      padding: 8px 10px;
      border-radius: 8px;
      cursor: pointer;
      box-shadow: 0px 3px 9px 0px rgba(0, 0, 0, 0.363);
    "
    >Confirma tu cuenta</a
  >
</div>
  `;
}
