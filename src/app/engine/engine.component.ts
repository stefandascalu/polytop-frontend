import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EngineService } from './engine.service';
import * as THREE from 'three';

@Component({
  selector: 'app-engine',
  templateUrl: './engine.component.html'
})
export class EngineComponent implements OnInit {

  @ViewChild('rendererCanvas', { static: true })
  public rendererCanvas: ElementRef<HTMLCanvasElement>;

  display = false;
  modalContent: string;

  constructor(private engServ: EngineService) {
    engServ.clickEmiter.subscribe((value) => {
      this.display = true;
      this.modalContent = value;
    });
  }

  ngOnInit() {
    this.engServ.createScene(this.rendererCanvas);
    this.engServ.animate();
  }
}
