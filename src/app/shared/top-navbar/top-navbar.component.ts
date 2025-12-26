import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from 'src/app/auth/services/token-storage.service';
import decode from "jwt-decode";

interface Payload {
  funcao : string,
  iat: number,
  exp: number,
  sub: string
}

@Component({
  selector: 'app-top-navbar',
  templateUrl: './top-navbar.component.html',
  styleUrls: ['./top-navbar.component.css']
})
export class TopNavbarComponent implements OnInit {

  userInfo: string
  isAdmin = false
  decodeToken: any

  constructor(
    private tokenStorage: TokenStorageService
  ) { }

  ngOnInit(): void {
    this.userInfo = this.tokenStorage.getUser()

    const token = this.tokenStorage.getToken() || ""
    const tokenPayload = decode<any>(token)

    if(tokenPayload.fresh.is_admin == true){
      this.isAdmin = true
    }

  }


  signOut(): void{
    this.tokenStorage.signOut()
  }
}
