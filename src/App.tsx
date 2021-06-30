import { useEffect, useRef, useState } from "react";
import {
  BoxGeometry,
  CylinderGeometry,
  EdgesGeometry,
  HemisphereLight,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  TextureLoader,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { bays, chestDemensions, palletCasesXYZ } from "./data/data";
import { IBay, IChestDimension, IPalletCaseXYZ } from "./models/models";

const App = () => {
  const ref: any = useRef(null);
  const [isBuild, setIsBuild] = useState(false);

  const location = (size: number, sizeSon: number) => {
    const locatio = size / 2;
    const son = sizeSon / 2;
    return locatio - son;
  };

  const loadTextures = async (url: string) => {
    const loader = new TextureLoader();
    if (url !== "") {
      try {
        const textures = await loader.loadAsync("assets/images/" + url);
        return new MeshBasicMaterial({ map: textures });
      } catch (error) {
        return new MeshBasicMaterial({ color: 0x00ff00 });
      }
    } else return new MeshBasicMaterial({ color: 0x00ff00 });
  };

  useEffect(() => {
    if (!isBuild) {
      const scene = new Scene();
      const start =new Date().getTime();
      const camera = new PerspectiveCamera(75, 900 / 900, 2, 1000);

      const renderer = new WebGLRenderer();
      renderer.setSize(900, 900);
      renderer.setClearColor(0xcccccc);
      ref.current.appendChild(renderer.domElement);

      const generateProducts = async (product: IPalletCaseXYZ) => {
        const bay = bays.find((x) => x.BayID === product.BayId)!;
        const parent = scene.children.find(
          (x) => x.name === `bay_${bay.BayID}`
        )!;

        let materialSmallerSide: MeshBasicMaterial;
        let materialLargerSide: MeshBasicMaterial;
        let materialTopSide: MeshBasicMaterial;
        if (product.TLoadPalletXYZ.ObjectType === 1) {
          if (product.TLoadPalletXYZ.SizeX > product.TLoadPalletXYZ.SizeY) {
            materialSmallerSide = await loadTextures(product.SmallerSideImage);
            materialLargerSide = await loadTextures(product.LargerSideImage);
          } else {
            materialSmallerSide = await loadTextures(product.LargerSideImage);
            materialLargerSide = await loadTextures(product.SmallerSideImage);
          }
          materialTopSide = await loadTextures(product.TopImage);
        } else {
          materialSmallerSide = await loadTextures(
            "/COMBINED/PF/" + product.TLoadPalletXYZ.ProductId + ".jpg"
          );
          materialLargerSide = await loadTextures(
            "/COMBINED/PL/" + product.TLoadPalletXYZ.ProductId + ".jpg"
          );
          materialTopSide = await loadTextures(
            "/COMBINED/PT/" + product.TLoadPalletXYZ.ProductId + ".jpg"
          );
        }

        const materials: MeshBasicMaterial[] = [
          materialSmallerSide,
          materialLargerSide,
          materialTopSide,
          materialSmallerSide,
          materialLargerSide,
          materialTopSide,
        ];

        if (product.TLoadPalletXYZ.Shape === 1) {
          if (
            product.TLoadPalletXYZ.Quantity === 1 ||
            product.TLoadPalletXYZ.Quantity >= 10
          ) {
            const geometry = new BoxGeometry(
              product.TLoadPalletXYZ.SizeX,
              product.TLoadPalletXYZ.SizeZ,
              product.TLoadPalletXYZ.SizeY,
              1,
              1,
              1
            );

            const cube = new Mesh(geometry, materials);
            cube.parent = parent;
            cube.position.set(
              -location(bay.SizeX, product.TLoadPalletXYZ.SizeX) +
                bay.PointX +
                product.TLoadPalletXYZ.PositionX,
              -location(bay.SizeY, product.TLoadPalletXYZ.SizeZ) +
                bay.PointY / 2 +
                product.TLoadPalletXYZ.PositionZ,
              -location(bay.SizeZ, product.TLoadPalletXYZ.SizeY) +
                bay.PointZ +
                product.TLoadPalletXYZ.PositionY
            );

            scene.add(cube);
          } else {
            let xSize,
              ySize,
              extraBoxX = 0,
              extraBoxY = 0;
            if (product.TLoadPalletXYZ.SizeX > product.TLoadPalletXYZ.SizeY) {
              xSize = product.PackageLargerSide;
              ySize = product.PackageSmallerSide;
            } else {
              xSize = product.PackageSmallerSide;
              ySize = product.PackageLargerSide;
            }

            const geometry = new BoxGeometry(
              xSize,
              product.TLoadPalletXYZ.SizeZ,
              ySize
            );

            const cube = new Mesh(geometry, materials);

            cube.parent = parent;
            cube.position.set(
              -location(bay.SizeX, product.TLoadPalletXYZ.SizeX) +
                bay.PointX +
                product.TLoadPalletXYZ.PositionX,
              -location(bay.SizeY, product.TLoadPalletXYZ.SizeZ) +
                bay.PointY / 2 +
                product.TLoadPalletXYZ.PositionZ,
              -location(bay.SizeZ, product.TLoadPalletXYZ.SizeY) +
                bay.PointZ +
                product.TLoadPalletXYZ.PositionY
            );
            if (product.TLoadPalletXYZ.SizeX > product.TLoadPalletXYZ.SizeY) {
              extraBoxX = xSize;
            } else {
              extraBoxY = ySize;
            }
            const geomtry2 = new BoxGeometry(
              xSize,
              product.TLoadPalletXYZ.SizeZ,
              ySize
            );
            const cube2 = new Mesh(geomtry2, materials);
            cube.position.set(
              -location(bay.SizeX, product.TLoadPalletXYZ.SizeX) +
                bay.PointX +
                product.TLoadPalletXYZ.PositionX -
                extraBoxX,
              -location(bay.SizeY, product.TLoadPalletXYZ.SizeZ) +
                bay.PointY / 2 +
                product.TLoadPalletXYZ.PositionZ,
              -location(bay.SizeZ, product.TLoadPalletXYZ.SizeY) +
                bay.PointZ +
                product.TLoadPalletXYZ.PositionY -
                extraBoxY
            );
            cube2.parent = parent;
            scene.add(cube, cube2);
          }
        } else if (product.TLoadPalletXYZ.Shape === 2) {
          const geometry = new CylinderGeometry(
            product.TLoadPalletXYZ.SizeX,
            product.TLoadPalletXYZ.SizeY,
            product.TLoadPalletXYZ.SizeZ
          );
          const cylinder = new Mesh(geometry, materials);
          cylinder.parent = parent;
          cylinder.position.set(
            -location(bay.SizeX, product.TLoadPalletXYZ.SizeX) +
              bay.PointX +
              product.TLoadPalletXYZ.PositionX,
            -location(bay.SizeY, product.TLoadPalletXYZ.SizeZ) +
              bay.PointY / 2 +
              product.TLoadPalletXYZ.PositionZ,
            -location(bay.SizeZ, product.TLoadPalletXYZ.SizeY) +
              bay.PointZ +
              product.TLoadPalletXYZ.PositionY
          );
          scene.add(cylinder);
        }
      };

      const generateBays = (bay: IBay) => {
        const geometry = new BoxGeometry(bay.SizeX, bay.SizeY, bay.SizeZ);
        const edges = new EdgesGeometry(geometry);
        const line = new LineSegments(
          edges,
          new LineBasicMaterial({ color: 0xff0000 })
        );
        const material = new MeshBasicMaterial({
          color: 0x00ff00,
          opacity: 0.0,
          transparent: true,
        });
        const cube = new Mesh(geometry, material);
        const parent = scene.children.find((x) => x.name === "truck_chest")!;
        cube.parent = parent;
        cube.name = `bay_${bay.BayID}`;
        cube.position.set(
          bay.PointX,
          -location(chestDemensions.chestSizeY, bay.SizeY) + bay.PointY,
          bay.PointZ
        );
        line.position.set(
          bay.PointX,
          -location(chestDemensions.chestSizeY, bay.SizeY) + bay.PointY,
          bay.PointZ
        );

        scene.add(line);
        scene.add(cube);
      };

      const generateTruckChest = (chestDimension: IChestDimension) => {
        const geometry = new BoxGeometry(
          chestDimension.chestSizeX,
          chestDimension.chestSizeY,
          chestDimension.chestSizeZ
        );
        console.log("ok");
        // const edges = new EdgesGeometry(geometry);
        // const line = new LineSegments(
        //   edges,
        //   new LineBasicMaterial({ color: 0x00ff00 })
        // );
        const material = new MeshBasicMaterial({
          color: 0x00ff00,
          opacity: 0.0,
          transparent: true,
        });

        const cube = new Mesh(geometry, material);
        cube.name = "truck_chest";
        scene.add(cube);
        // scene.add(line);
      };

      const loadCabin = () => {
        const loader = new GLTFLoader();
        loader.load(
          "assets/3d/cabinNewGltf.glb",
          (gltf) => {
            const object = gltf.scene;
            const bay = bays[0];
            object.traverse((child) => {
              child.position.set(bay.PointX + 1, -1.9, 0.5);
              child.scale.set(0.35, 0.35, 0.35);
              if (child instanceof Mesh) {
                console.log(child.name);
                if (
                  child.name === "adtruck_2" ||
                  child.name === "adtruck_3" ||
                  child.name === "adtruck_4" ||
                  child.name === "adtruck_6"
                )
                  child.material = new MeshBasicMaterial({ color: 0x030303 });
                else if (child.name === "adtruck_5")
                  child.material = new MeshBasicMaterial({ color: 0xeeffee });
                else if (child.name === "adtruck_7")
                  child.material = new MeshBasicMaterial({ color: 0xff5500 });
                else if (child.name === "adtruck_8")
                  child.material = new MeshBasicMaterial({ color: 0x010101 });
                else if (child.name === "adtruck_9")
                  child.material = new MeshBasicMaterial({ color: 0xeeeeee });
                else if (child.name === "adtruck_10")
                  child.material = new MeshBasicMaterial({ color: 0xff0000 });
                else if (child.name === "adtruck_11")
                  child.material = new MeshBasicMaterial({ color: 0xff0000 });
                else if (child.name === "adtruck_12")
                  child.material = new MeshBasicMaterial({ color: 0x444444 });
              }
            });
            const geometry = new CylinderGeometry(0.4, 0.4, 0.1, 86, 86);
            const material = new MeshBasicMaterial({ color: 0xeeeeee });
            const wheel = new Mesh(geometry, material);
            wheel.rotateX((Math.PI / 180) * 90);
            wheel.position.set(bay.PointX - 2.28, -2.05, -0.95);

            const wheel2 = new Mesh(geometry, material);
            wheel2.rotateX((Math.PI / 180) * 90);
            wheel2.position.set(bay.PointX - 2.28, -2.05, 1.85);

            scene.add(object, wheel, wheel2);
          },
          undefined,
          (error) => console.log(error)
        );
      };

      const controls = new OrbitControls(camera, renderer.domElement);

      const light = new HemisphereLight(0xffffff, 0x080820, 1);
      scene.add(light);

      camera.position.z = 20;
      controls.update();

      generateTruckChest(chestDemensions);
      bays.forEach((x) => generateBays(x));
      palletCasesXYZ.forEach((x) => generateProducts(x));
      loadCabin();

      const render = () => {
        requestAnimationFrame(render);
        renderer.render(scene, camera);
      };
      render();
      setIsBuild(true);
      const end =new Date().getTime();
      console.log((end - start))
    }
  }, [ref, isBuild]);

  return (
    <>
      <div>{/* <img src="assets/images/172131F.jpg" /> */}</div>
      <div ref={ref} style={{ marginLeft: "28%" }}></div>
    </>
  );
};

export default App;
