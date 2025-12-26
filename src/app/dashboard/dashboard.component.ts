import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth/services/auth.service';
import { SimulationsService } from '../services/simulations.service';
import { UserService } from '../user/service/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  simulations:any
  users:any
  createUserForm: FormGroup
  createSimulationForm: FormGroup

  constructor(
    private simulationsService: SimulationsService,
    private usersService: UserService,
    private authService: AuthService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getAllSimulation()
    this.getAllUsers()
    this.createUserForm = new FormGroup({
      name :  new FormControl(null,[Validators.required]),
      email :  new FormControl(null,[Validators.required, Validators.email]),
      password :  new FormControl(null,[Validators.required])
    })

    this.createSimulationForm = new FormGroup({
      n_machines: new FormControl(null,[Validators.required]),
      n_jobs: new FormControl(null,[Validators.required]),
      n_operations: new FormControl(null,[Validators.required])
    })
  }

  getAllSimulation(): void {
    this.simulationsService.getAllSimulations().subscribe(res=>{
      this.simulations = res.simulations
      console.log(res.simulations)
    })
  }

  getAllUsers():void{
    this.usersService.getAllUsers().subscribe(allUsers => {
      this.users = allUsers.users
      console.log(allUsers)
    })
  }

  onCreateSimulation():void{
    if(this.createSimulationForm.valid){
      this.simulationsService.createSimulation(this.createSimulationForm.value).subscribe(data => {
        this.getAllSimulation()
        this.toastr.success('Simulação criada com sucesso', data._id.$oid );
        this.createSimulationForm.reset()
      })
    }
  }

  onCreateUser():void{
    if(this.createUserForm.valid){
      this.authService.register(this.createUserForm.value).subscribe(data => {
        this.getAllUsers();
        this.toastr.success('Utilizador criado com sucesso',data.name + " : " + data._id.$oid );
        this.createUserForm.reset()
      })
    }
  }
}
