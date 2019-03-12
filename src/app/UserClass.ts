export class User {
  public access_suggest: string;
  public access_write: string;
  public admin: number;
  public email: string;
  public id: number;
  public login: string;
  public name: string;
  public password: string;
  public surname: string;
  constructor(admin: number, email: string, id: number, login: string, name: string, password: string, surname: string,
              access_write: string = '1', access_suggest: string = '1') {
    this.admin = admin;
    this.email = email;
    this.id = id;
    this.login = login;
    this.name = name;
    this.password = password;
    this.surname = surname;
    this.access_suggest = access_suggest;
    this.access_write = access_write;
  }
  // setters
  /*
  set_Access_suggest(acces_suggest: string) {
    this.access_suggest = acces_suggest;
  }
  set_Access_write(access_write: string) {
    this.access_write = access_write;
  }
  set_Admin(admin: number) {
    this.admin = admin;
  }
  set_Email(email: string) {
    this.access_suggest = email;
  }
  set_Id(id: number) {
    this.id = id;
  }
  set_Login(login: string) {
    this.login = login;
  }
  set_Password(password: string) {
    this.password = password;
  }
  set_Name(name: string) {
    this.name = name;
  }
  set_Surname(surname: string) {
    this.surname = surname;
  }
  // getters
  get_Access_suggest(): string {
    return this.access_suggest;
  }
  get_Access_write(): string {
    return this.access_write;
  }
  get_Admin(): number {
    return this.admin;
  }
  get_Email(): string {
    return this.access_suggest;
  }
  get_Id(): number {
    return this.id;
  }
  get_Login(): string {
    return this.login;
  }
  get_Password(): string {
    return this.password;
  }
  get_Name(): string {
    return this.name;
  }
  get_Surname(): string {
    return this.surname;
  }
*/
}
