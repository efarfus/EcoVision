// Verificar se ainda será utilizado

class HttpError extends Error {
  public code: number;

  constructor(message: string, errorCode: number) {
    super(message);
    this.code = errorCode;
  }

  public toHtml(): string {
    if(this.message === "Not authenticated!" || this.message === "Signing up failed, please try again later." || this.message === "This email is already in use!" || this.message === "Logging in failed, please try again later."){
      return `
      <html>
        <body>
          <h1>Error ${this.code}</h1>
          <p>${this.message}</p>
          <button onclick="window.location.href='/';">SignUp/Login</button>
        </body>
      </html>
    `;
    } else if (this.message === 'Invalid Input detected, please verify your data') {
      return `
      <html>
        <body>
          <h1>Error ${this.code}</h1>
          <p>${this.message}</p>
          <button onclick="window.location.href='/signUp';">Try again</button>
        </body>
      </html>
    `;
    } else if (this.message === 'You have already submitted this form') {
      return `
      <html>
        <body>
          <h1>Error ${this.code}</h1>
          <p>${this.message}</p>
          <button onclick="window.location.href='/createFormReopenRequest/<%= formId %>';">Request Form Reopening</button>
          <button onclick="window.location.href='/home';">Return to HomePage</button>
        </body>
      </html>
    `;
    } else {
      return `
        <html>
          <body>
            <h1>Error ${this.code}</h1>
            <p>${this.message}</p>
            <button onclick="window.location.href='/home';">HomePage</button>
          </body>
        </html>
      `;
    }
  }

  public logDetails(): void {
    console.error(`Error ${this.code}: ${this.message}`);
  }
}

export default HttpError;
