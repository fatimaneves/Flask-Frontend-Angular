import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SimulationsService } from '../services/simulations.service';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexPlotOptions,
  ApexXAxis,
  ApexFill,
  ApexDataLabels,
  ApexYAxis,
  ApexGrid
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  fill: ApexFill;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  plotOptions: ApexPlotOptions;
};


interface Simulation {
  jobs: [{
    name: string
    operations: []
  }],
  n_jobs: number,
  n_machines: number,
  n_operations: number,
  _id: {
    $oid: string
  }
}

@Component({
  selector: 'app-simulation',
  templateUrl: './simulation.component.html',
  styleUrls: ['./simulation.component.css']
})
export class SimulationComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent | any;
  public chartOptions: Partial<ChartOptions> | any;

  simulationInfo: Simulation
  formArray: FormArray
  formGroupSimulation: FormGroup
  googleInfo: any
  formBuilder: any
  nOperations: any
  cols: number
  rows: number
  constructor(
    private route: ActivatedRoute,
    private simulationService: SimulationsService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getData()

  }

  googleSimulation(): void {
    this.simulationService.getGooleSimulation(this.route.snapshot.paramMap.get('id')!).subscribe(data => {
      this.InitChart(data)
      this.googleInfo = data
    })
  }

  getData(): void {
    this.simulationService.getSimulationById(this.route.snapshot.paramMap.get('id')!).subscribe((data: Simulation) => {
      this.simulationInfo = data
      this.generateTable(data.jobs)
      if (data != null) {
        this.googleSimulation()
      }
    })
  }


  deleteSimulation(): void {
    this.simulationService.deleteSimulationById(this.route.snapshot.paramMap.get('id')!).subscribe(data => {
      this.toastr.success('Utilizador apagado com sucesso', this.simulationInfo._id.$oid);
      window.location.href = '/dashboard';
    }, err => {
      this.toastr.error(err.error.error);
    })
  }

  get jobs() {
    return this.formBuilder.get('jobs') as FormArray;
  }


  generateTable(dataJobs: any): void {

    this.formBuilder = this.fb.group({
      jobs: this.fb.array([
        this.fb.group({
          name: this.fb.control(null),
          operations: this.fb.array([Validators.required])
        })
      ])
    })
    this.jobs.removeAt(0)
    if (dataJobs != null) {

      for (let i = 0; i < dataJobs.length; i++) {
        this.jobs.push(this.fb.group({
          name: dataJobs[i].name, operations:
            this.fb.array(dataJobs[i].operations.map((operation: any) => this.fb.control(operation)))
        }))
      }
    } else {
      const operationsArray: any[] = []
      for (let i = 0; i < this.simulationInfo.n_operations; i++) {
        operationsArray.push(['(M0,0)'])
      }
      for (let i = 0; i < this.simulationInfo.n_jobs; i++) {
        console.log(i)
        this.jobs.push(this.fb.group({
          name: "Job " + i,
          operations: this.fb.array(operationsArray)
        }))
      }
    }
  }



  updateValue(): void {
    this.simulationService.updateJobInSimulation(this.route.snapshot.paramMap.get('id')!, this.formBuilder.value).subscribe(data => {

      this.googleSimulation()
      const info = []


      for (let i = 0; i < this.googleInfo.jobs.length; i++) {
        for (let j = 0; j < this.googleInfo.jobs[i].job.length; j++) {
          info.push({
            x: "Job " + [i],
            y: data.jobs[i].operations[j],
            fillColor: data[i]
          })
        }
      }

      this.chartOptions.series = [{
        data: info
      }];
      console.log(this.chartOptions)
    })
  }

  InitChart(dataJobs: any) {
    const info = []

    const colors = ["#8003fc", "#036ffc", "#fcba03", "#03fc20", "#03fcfc", "#e703fc", "#fc036f"]

    for (let i = 0; i < dataJobs.jobs.length; i++) {
      for (let j = 0; j < dataJobs.jobs[i].job.length; j++) {
        info.push({
          x: "Machine " + [i],
          y: dataJobs.jobs[i].job[j],
          fillColor: colors[i]
        })
      }
    }

    this.chartOptions = {
      series: [
        {
          data: info
        }
      ],
      chart: {
        height: 350,
        type: "rangeBar"
      },
      plotOptions: {
        bar: {
          horizontal: true,
          distributed: true,
          dataLabels: {
            hideOverflowingLabels: false
          }
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function (val: any, opts: any) {
          var label = opts.w.globals.labels[opts.dataPointIndex];
          return "[" + val + "]";
        }
      },
      xaxis: {
        type: "number"
      },
      yaxis: {
        show: true
      },
      grid: {
        row: {
          colors: ["#fff", "#fff"],
          opacity: 1
        }
      }
    };
  }
}
