import { Func } from '../core/func';
import { Canvas } from '../webgl/canvas';
import { Object3D } from 'three/src/core/Object3D';
import { Update } from '../libs/update';
import { Box } from './box';
import { DirectionalLight } from 'three/src/lights/DirectionalLight';
import { AmbientLight } from 'three/src/lights/AmbientLight';
import { SphereGeometry } from 'three/src/geometries/SphereGeometry';
import { Util } from '../libs/util';
import { Conf } from '../core/conf';

export class Visual extends Canvas {

  private _con:Object3D;
  private _light:DirectionalLight;
  private _box: Array<Box> = [];
  private _boxNum: number = 5;

  constructor(opt: any) {
    super(opt);

    this._light = new DirectionalLight(Util.instance.randomArr(Conf.instance.COLOR).clone(), 1);
    this.mainScene.add(this._light)
    this._light.position.set(-200, 200, 0);

    const ambientLight = new AmbientLight(Util.instance.randomArr(Conf.instance.COLOR).clone(), 1);
    this.mainScene.add(ambientLight)

    this._con = new Object3D();
    this.mainScene.add(this._con);

    const seg = 32;
    const geo = new SphereGeometry(0.5, seg, seg);
    for(let i = 0; i < this._boxNum; i++){
      const b = new Box(i, geo);
      this._con.add(b);
      this._box.push(b);
    }

    this._resize();
  }


  protected _update(): void {
    super._update();

    const w = Func.instance.sw();
    // const h = Func.instance.sh();
    const it = w / this._boxNum;

    this._box.forEach((val, i) => {
      const radius = it * 0.5;
      val.setBoxSize(radius, radius, radius);
      val.position.x = i * it - (it * this._boxNum * 0.5) + it * 0.5;
      val.position.y = -val.allSize.y * 0.275
    });

    if (this.isNowRenderFrame()) {
      this._render()
    }
  }


  private _render(): void {
    this.renderer.setClearColor(0x000000, 1);
    this.renderer.render(this.mainScene, this.cameraOrth);
  }


  public isNowRenderFrame(): boolean {
    return this.isRender && Update.instance.cnt % 1 == 0
  }


  _resize(): void {
    super._resize();

    const w = Func.instance.sw();
    const h = Func.instance.sh();

    this.renderSize.width = w;
    this.renderSize.height = h;

    this._updateOrthCamera(this.cameraOrth, w, h);

    this.cameraPers.fov = 80;
    this._updatePersCamera(this.cameraPers, w, h);

    let pixelRatio: number = window.devicePixelRatio || 1;
    this.renderer.setPixelRatio(pixelRatio);
    this.renderer.setSize(w, h);
    this.renderer.clear();
  }
}
