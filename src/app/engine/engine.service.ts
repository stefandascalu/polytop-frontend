import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {Injectable, ElementRef, OnDestroy, NgZone, EventEmitter} from '@angular/core';
import { Interaction } from 'three.interaction';
import {Mesh, Object3D} from 'three';

@Injectable({
  providedIn: 'root'
})
export class EngineService implements OnDestroy {
  private canvas: HTMLCanvasElement;
  public renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  public scene: THREE.Scene;
  private controls: OrbitControls;
  private light: THREE.AmbientLight;
  private raycaster: THREE.Raycaster;
  private mouse: THREE.Vector2;
  private INTERSECTED;

  private cube: THREE.Mesh;
  private sphere: THREE.Mesh;

  private frameId: number = null;

  clickEmiter: EventEmitter<string> = new EventEmitter<string>();

  public constructor(private ngZone: NgZone) {
    // this.createScene = this.createScene.bind(this);
  }

  public ngOnDestroy() {
    if (this.frameId != null) {
      cancelAnimationFrame(this.frameId);
    }
  }

  createScene(canvas: ElementRef<HTMLCanvasElement>): void {
    // The first step is to get the reference of the canvas element from our HTML document
    this.canvas = canvas.nativeElement;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,    // transparent background
      antialias: true // smooth edges
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // create the scene
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
    this.camera.position.set(0, 0, 100);
    this.camera.lookAt(0, 0, 0);
    // this.camera.position.z = 5;
    this.scene.add(this.camera);

    const meshes = this.createSphereList(10);
    meshes.forEach(e => this.scene.add(e));

    const material = new THREE.LineBasicMaterial({ color: 0x0000ff , linewidth: 100});

    const geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3( -10, -3, 0) );
    geometry.vertices.push(new THREE.Vector3( 0, 10, 0) );
    geometry.vertices.push(new THREE.Vector3( 10, -3, 0) );
    geometry.vertices.push(new THREE.Vector3(-10, -3, 0));

    const line = new THREE.Line( geometry, material );
    this.scene.add(line);

    const geometryLine = new THREE.Geometry();
    geometryLine.vertices.push(new THREE.Vector3( -10, 7, 0) );
    geometryLine.vertices.push(new THREE.Vector3( 0, -7, 0) );
    geometryLine.vertices.push(new THREE.Vector3( 10, 7, 0) );
    geometryLine.vertices.push(new THREE.Vector3(-10, 7, 0));
    const line2 = new THREE.Line(geometryLine, material);
    this.scene.add(line2);

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    console.log(this.raycaster);
    this.renderer.domElement.addEventListener('click', (e) => this.onDocumentMouseDown(e), false);
    this.scene.children.forEach(e => console.log(e));

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.addEventListener('change', () => this.renderer.render(this.scene, this.camera));
    this.controls.minDistance = 10;
    this.controls.maxDistance = 50;
    this.controls.enablePan = false;
    // this.renderer.render(this.scene, this.camera);
  }

  createSphere(x: number, y: number, z: number): THREE.Mesh {
    const geometrySphere = new THREE.SphereGeometry(2, 32, 32);
    const materialSphere = new THREE.MeshBasicMaterial({color: 0x00ff00});
    const sphere = new THREE.Mesh(geometrySphere, materialSphere);
    sphere.uuid = 'test' + x + y + z;
    sphere.position.set(x, y, z);
    sphere.userData = {
      type: 'node'
    };
    return sphere;
  }

  createSphereList(offset: number): Array<THREE.Mesh> {
    const sphereArray = new Array<THREE.Mesh>();

    sphereArray.push(this.createSphere(-offset, -3, 0));
    sphereArray.push(this.createSphere(0, offset, 0));
    sphereArray.push(this.createSphere(offset, -3, 0));

    sphereArray.push(this.createSphere(-offset, 7, 0));
    sphereArray.push(this.createSphere(0, -7, 0));
    sphereArray.push(this.createSphere(offset, 7, 0));

    return sphereArray;
  }


  onDocumentMouseDown( event ) {
    console.log(this);
    event.preventDefault();
    this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children);
    console.log(intersects);
    if (intersects.length > 0 && intersects[0].object.userData.type === 'node') {
      this.INTERSECTED = intersects[0].object as Mesh;
      console.log(this.INTERSECTED);
      this.INTERSECTED.material.color.set( 0xff0000 );
      this.clickEmiter.emit(this.INTERSECTED.uuid);
      this.render();
    }
  }

  animate(): void {
    // We have to run this outside angular zones,
    // because it could trigger heavy changeDetection cycles.
    this.ngZone.runOutsideAngular(() => {
      if (document.readyState !== 'loading') {
        this.render();
      } else {
        window.addEventListener('DOMContentLoaded', () => {
          this.render();
        });
      }
      window.addEventListener('resize', () => {
        this.resize();
      });
    });
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize( width, height );
  }
}
