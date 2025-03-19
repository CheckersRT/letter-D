import GUI from "lil-gui"
import * as THREE from "three"
import { FontLoader, OrbitControls, RGBELoader, TextGeometry } from "three/examples/jsm/Addons.js"
import addGUI from "./GUI"
import gsap from "gsap"
import addArrows from "./arrow"

const canvas = document.querySelector("canvas.webgl")

let width = window.innerWidth, height = window.innerHeight

let scene, camera, pivot, renderer, controls, d, cube, planes, frameMat

init()

function init() {

    scene = new THREE.Scene()

    camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000)
    camera.position.z = 8
    pivot = new THREE.Object3D()
    pivot.add(camera)
    scene.add(pivot)

    controls = new OrbitControls(camera, canvas)
    controls.minPolarAngle = Math.PI /2
    controls.maxPolarAngle = Math.PI /2

    const rgbeLoader = new RGBELoader()
    const environmentMap = rgbeLoader.load("/environmentMap/2k.hdr", (environmentMap) => {
        environmentMap.mapping = THREE.EquirectangularReflectionMapping
        scene.environment = environmentMap
        scene.background = environmentMap
        scene.environmentIntensity = 1
        scene.backgroundBlurriness = 0.8
    })
    addLetterD()
    addCube(undefined, () => {
        console.log("onLoad in add Cube");
        addPlanes(environmentMap)
    })
    addArrows(scene)

    renderer = new THREE.WebGLRenderer({canvas: canvas})
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setAnimationLoop(animate)
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.toneMappingExposure = 0.9

}

window.addEventListener("resize", onResize)

function onResize() {
    width = window.innerWidth
    height = window.innerHeight

    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    camera.aspect = width / height
    camera.updateProjectionMatrix()
}

function addLetterD() {
    const fontLoader = new FontLoader()

    fontLoader.load("/fonts/optimer_bold.typeface.json", (font) => {
        const dGeo = new TextGeometry("D", {
            font,
            size: 2.5,
            depth: 0.2,
            curveSegments: 16,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 3
        })
        dGeo.center()

        const dParams = {
            color: "#e61919",
            metalness: 1,
            roughness: 0.01,
            emissive: "#202822",
            emissiveIntensity: 0,
        }
        const dMat = new THREE.MeshPhysicalMaterial({
            wireframe: true,
            emissive: dParams.emissive,
            roughness: dParams.roughness,
            metalness: dParams.metalness,
            color: dParams.color,
            emissiveIntensity: dParams.emissiveIntensity,
            clearcoat: 1,
            clearcoatRoughness: 0.5,
        })    
        
        addGUI("D", dParams, dMat)
        d = new THREE.Mesh(dGeo, dMat)
        scene.add(d)
    })
}

function addCube(textures, onLoad) {
    
    if(!textures) {
        loadCubeTextures(onLoad)
        return
    }
        
    for(const textureName in textures) {
        const texture = textures[textureName]
        texture.repeat.set(6,5)
        texture.offset.set(1, 3)
        texture.wrapS = THREE.MirroredRepeatWrapping
        texture.wrapT = THREE.MirroredRepeatWrapping
    }

    cube = new THREE.Object3D()
    cube.name = "cube"
    const frameGeo = new THREE.RingGeometry(2.75, 3, 4, 32, Math.PI/4)
    frameGeo.center()
    frameGeo.computeBoundingBox()
    const size = new THREE.Vector3()
    frameGeo.boundingBox.getSize(size)
    const radius = size.x / 2
    
    frameMat = new THREE.MeshStandardMaterial({side: THREE.DoubleSide})

    const params = {
        aoMapIntensity: 1,
        heightScale: 0,
        metalness: 1,
        roughness: 1,
    }

    frameMat.map = textures.color
    frameMat.aoMap = textures.ao
    frameMat.aoMapIntensity = params.aoMapIntensity
    frameMat.displacementMap = textures.height
    frameMat.displacementScale = params.heightScale
    // frameMat.metalnessMap = textures.metalness
    frameMat.metalness = params.metalness
    // frameMat.roughnessMap = textures.roughness
    frameMat.roughness = params.roughness
    frameMat.normalMap = textures.normal
    frameMat.normalScale = new THREE.Vector2(0.3, 0.3)
    // frameMat.opactiy = textures.opactiy
    
    addGUI("frame", params, frameMat)

    const direction = [
        { axis: 'x', sign: 1 },
        { axis: 'x', sign: -1 },
        { axis: 'y', sign: 1 },
        { axis: 'y', sign: -1 },
        { axis: 'z', sign: 1 },
        { axis: 'z', sign: -1 },
    ]
    for(let i = 0; i < 6; i++) {
        const side = new THREE.Mesh(frameGeo, frameMat)
        const axis = direction[i].axis
        const sign = direction[i].sign        
        side.position[axis] = radius * sign
        side.lookAt(new THREE.Vector3(0, 0, 0))
        cube.add(side)
    }

    scene.add(cube)
    onLoad()
}

function getCubeInnerRadius() {
    const cube = scene.getObjectByName("cube")
    const frameGeo = cube.children[0].geometry
    const innerDiagonalRadius = frameGeo.parameters.innerRadius
    const radius = innerDiagonalRadius * Math.sin(Math.PI/4)    
    return radius
}
function getCubeOuterRadius() {
    const cube = scene.getObjectByName("cube")
    const frameGeo = cube.children[0].geometry
    const outerDiagonalRadius = frameGeo.parameters.outerRadius
    const radius = outerDiagonalRadius * Math.sin(Math.PI/4)
    return radius
}

function loadCubeTextures(onLoad) {
    const textures = {}
    const manager = new THREE.LoadingManager(() => {
        console.log("in onLoad in manager", textures)
        addCube(textures, onLoad)
    })
    const textureLoader = new THREE.TextureLoader(manager)
    textureLoader.load("/textures/Metal_Rusted_010_SD/Metal_Rusted_010_basecolor.jpg", (texture) => {
        textures["color"] = texture
    })
    textureLoader.load("/textures/Metal_Rusted_010_SD/Metal_Rusted_010_ambientOcclusion.jpg", (texture) => {
        textures["ao"] = texture
    })
    textureLoader.load("/textures/Metal_Rusted_010_SD/Metal_Rusted_010_height.png", (texture) => {
        textures["height"] = texture
    })
    textureLoader.load("/textures/Metal_Rusted_010_SD/Metal_Rusted_010_metallic.jpg", (texture) => {
        textures["metalness"] = texture
    })
    textureLoader.load("/textures/Metal_Rusted_010_SD/Metal_Rusted_010_normal.jpg", (texture) => {
        textures["normal"] = texture
    })
    textureLoader.load("/textures/Metal_Pierced_001_SD/Metal_Pierced_001_4K_opacity.png", (texture) => {
        textures["opacity"] = texture
    })
    textureLoader.load("/textures/Metal_Rusted_010_SD/Metal_Rusted_010_roughness.jpg", (texture) => {
        textures["roughness"] = texture
    })
}

function addPlanes(environmentMap, normals, alphaMap) {    
    let normal1, normal2, normal3, normal4
    if(!normals) {
        let alphaMap
        const manager = new THREE.LoadingManager(() => {
            const normals = [normal1, normal2, normal3, normal4]
            console.log("Finished loading normals", normals, alphaMap);
            addPlanes(environmentMap, normals, alphaMap)
        })
        const textureLoader = new THREE.TextureLoader(manager)
        textureLoader.load("/normals/tree_01_normal.jpg", (texture) => {
            normal1 = texture
        })
        textureLoader.load("/normals/Roofing_002_NRM.jpg", (texture) => {
            normal2 = texture
        })
        textureLoader.load("/normals/Organic_Scales_001_normal.jpg", (texture) => {
            normal3 = texture
        })
        textureLoader.load("/normals/Sci-fi_Wall_005_normal.jpg", (texture) => {
            normal4 = texture
        })
        textureLoader.load("/alphaMaps/border.png", (texture) => {
            alphaMap = texture
            alphaMap.colorSpace = THREE.SRGBColorSpace
        })
        return
    }

    console.log("has to be normals here", normals, alphaMap);
    planes = new THREE.Group()
    
    const params = {
        color: 0xffffff,
        opacity: 1,
        metalness: 0,
        roughness: 0,
        ior: 1.03,
        // normalScale: 0.5,
        thickness: 0.25,
        specularIntensity: 0,
        specularColor: 0xffffff,
        envMapIntensity: 1,
        exposure: 0.9,
        transmission: 1,
        transmissionResolutionScale: 1,
    };

    const innerRadius = getCubeInnerRadius()
    const outerRadius = getCubeOuterRadius()

    const planeGeo = new THREE.PlaneGeometry(innerRadius * 2 - 0.1, innerRadius * 2 - 0.1, 100, 100)
    
    const planeMat = new THREE.MeshPhysicalMaterial({
            color: params.color,
            opacity: params.opacity,
            metalness: params.metalness,
            roughness: params.roughness,
            ior: params.ior,
            normalScale: new THREE.Vector2(40, 40),
            thickness: params.thickness,
            alphaMap: alphaMap,
            envMap: environmentMap,
            envMapIntensity: params.envMapIntensity,
            transmission: params.transmission, // use planeMat.transmission for glass planeMats
            specularIntensity: params.specularIntensity,
            specularColor: params.specularColor,
            side: THREE.FrontSide,
            transparent: true,
        }
    )
        
    normals.forEach((normal, index) => {
        const newPlaneMat = planeMat.clone()
        const newParams = params
        newPlaneMat.normalMap = normal
        addGUI(`plane${index + 1}`, newParams, newPlaneMat)
        const plane = new THREE.Mesh(planeGeo,newPlaneMat)
        const d0 = camera.position.z
        const d1 = camera.position.z + outerRadius
        const scale = d0 / d1
    
        plane.scale.set(scale, scale, 1);
        plane.rotation.y = -Math.PI / 2 * index
        planes.add(plane)
    })
    scene.add(planes)

}



window.addEventListener("keydown", onKeyDown)
let angle = 0
function onKeyDown(event) {
    if(event.code !== "ArrowLeft" && event.code !== "ArrowRight") return
	if (event.code === 'ArrowLeft') {
		angle += Math.PI / 2;
	}
	if (event.code === 'ArrowRight') {
		angle -= Math.PI / 2;
	}

    let arrows
    scene.traverse((object) => {        
        if(object.name === "arrowContainer") {
            arrows = object
        }
    })

    gsap.to(pivot.rotation, {
        y: -angle,
        duration: 1,
        ease: "power2.out"
    })
    gsap.to(arrows.rotation, {
        y: -angle,
        duration: 1,
        ease: "power2.in"
    }, "<")
    
    let tl = gsap.timeline()

    // tl.restart()
    tl.fromTo(frameMat, {displacementScale: 0},{
        displacementScale: 4,
        duration: 0.5,
        ease: "power2.out",
        onComplete: () => {
            tl.reverse()
        }
    })
    tl.fromTo(planes.scale, {x: 1, y: 1, z: 1},{
        x: 0,
        y: 0,
        z: 0,
        duration: 0.5,
        onComplete: () => {
            tl.reverse()
        }
    }, "<")

}

function animate() {
    if(!d) return  

    d.rotation.y += 0.01        

    renderer.render(scene, camera)
}

