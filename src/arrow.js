import * as THREE from "three"

export default function addArrows(scene) {

    const textureLoader = new THREE.TextureLoader()
    const matcapTexture = textureLoader.load("/matcaps/white-metal.png")

    const arrowShape = new THREE.Shape()
    arrowShape.moveTo(0, 0)
    arrowShape.lineTo(0.5, 0.5)
    arrowShape.lineTo(0.25, 0.5)
    arrowShape.lineTo(-0.25, 0)
    arrowShape.lineTo(0.25, -0.5)
    arrowShape.lineTo(0.5, -0.5)

    const arrowGeo = new THREE.ExtrudeGeometry(arrowShape, {
        depth: 0.04,
        bevelSize: 0.05,
        bevelThickness: 0.01,
        bevelSegments: 8,
        bevelEnabled: true,
    })
    arrowGeo.center()
    const arrowMat = new THREE.MeshStandardMaterial({side: THREE.DoubleSide})

    const arrowLeft = new THREE.Mesh(arrowGeo, arrowMat)
    arrowLeft.position.x = -4
    const arrowRight = new THREE.Mesh(arrowGeo, arrowMat)
    arrowRight.rotation.y = Math.PI
    arrowRight.position.x = 4

    const arrowContainer = new THREE.Object3D()
    arrowContainer.name = "arrowContainer"
    arrowContainer.add(arrowLeft, arrowRight)

    scene.add(arrowContainer)

}