import GUI from "lil-gui";

const gui = new GUI()


export default function addGUI(name, params, material) {
    switch (name) {
        case "D":
            const dFolder = gui.addFolder("D")

            dFolder.add(material, "wireframe")

            dFolder.addColor(params, "color").onChange((value) => {
                material.color.set(params.color)
                material.needsUpdate = true
            })
            dFolder.addColor(params, "emissive").onChange((value) => {
                material.emissive.set(params.emissive)
                material.needsUpdate = true
            })
            dFolder.add(material, "emissiveIntensity", 0.1, 10, 0.1)
            dFolder.add(params, "roughness", 0.01, 1, 0.01).onChange((value) => {
                material.roughness = value
            })
            dFolder.add(params, "metalness", 0.01, 1, 0.01).onChange((value) => {
                material.metalness = value
            })
            break;
        case "side1":
            // material.ior = 1
            // material.thickness = 0
            material.normalMap.repeat.set(0.65, 0.3)

            const side1Folder = gui.addFolder("Side 1")
        
            side1Folder.add( params, 'ior', 1, 2, 0.01 )
                .onChange(() => {
                    material.ior = params.ior;
                } );
        
            side1Folder.add( params, 'thickness', 0, 1, 0.01 )
                .onChange(() => {
                    material.thickness = params.thickness;
                } );
            side1Folder.add( params, 'reflectivity', 0, 1, 0.01 )
                .onChange(() => {
                    material.reflectivity = params.reflectivity;
                } );
            side1Folder.add(params, "normalScaleX", 0.01, 2, 0.01).onChange((value) => {
                const y = material.normalMap.repeat.y
                material.normalMap.repeat.set(value, y)
            })
            side1Folder.add(params, "normalScaleY", 0.01, 2, 0.01).onChange((value) => {
                const x = material.normalMap.repeat.x
                material.normalMap.repeat.set(x, value)
            })
            break;
        case "side2":
            // material.ior = 1
            material.thickness = 0.21
            material.reflectivity = 0.5
            material.normalMap.repeat.set(0.2, 0.3)

            console.log("material side 2", material)
            
            const side2Folder = gui.addFolder("Side 2")
        
            side2Folder.add( params, 'ior', 1, 2, 0.01 )
                .onChange(() => {
                    material.ior = params.ior;
                } );
        
            side2Folder.add( params, 'thickness', 0, 1, 0.01 )
                .onChange(() => {
                    material.thickness = params.thickness;
                } );
            side2Folder.add( params, 'reflectivity', 0, 1, 0.01 )
                .onChange(() => {
                    material.reflectivity = params.reflectivity;
                } );
            side2Folder.add(params, "normalScaleX", 0.01, 2, 0.01).onChange((value) => {
                const y = material.normalMap.repeat.y
                material.normalMap.repeat.set(value, y)
            })
            side2Folder.add(params, "normalScaleY", 0.01, 2, 0.01).onChange((value) => {
                const x = material.normalMap.repeat.x
                material.normalMap.repeat.set(x, value)
            })
            break;
        case "side3":
            // material.ior = 1
            material.thickness = 0.21
            material.reflectivity = 0.5
            material.normalMap.repeat.set(0.4, 0.5)

            console.log("material side 3", material)
            
            const side3Folder = gui.addFolder("Side 3")
        
            side3Folder.add( params, 'ior', 1, 2, 0.01 )
                .onChange(() => {
                    material.ior = params.ior;
                } );
        
            side3Folder.add( params, 'thickness', 0, 1, 0.01 )
                .onChange(() => {
                    material.thickness = params.thickness;
                } );
            side3Folder.add( params, 'reflectivity', 0, 1, 0.01 )
                .onChange(() => {
                    material.reflectivity = params.reflectivity;
                } );
            side3Folder.add(params, "normalScaleX", 0.01, 2, 0.01).onChange((value) => {
                const y = material.normalMap.repeat.y
                material.normalMap.repeat.set(value, y)
            })
            side3Folder.add(params, "normalScaleY", 0.01, 2, 0.01).onChange((value) => {
                const x = material.normalMap.repeat.x
                material.normalMap.repeat.set(x, value)
            })

            break;

        case "side4":
            // material.ior = 1
            material.thickness = 0.21
            material.reflectivity = 0.5
            material.normalMap.repeat.set(0.8, 0.66)

            console.log("material side 3", material)
            
            const side4Folder = gui.addFolder("Side 4")
        
            side4Folder.add( params, 'ior', 1, 2, 0.01 )
                .onChange(() => {
                    material.ior = params.ior;
                } );
        
            side4Folder.add( params, 'thickness', 0, 1, 0.01 )
                .onChange(() => {
                    material.thickness = params.thickness;
                } );
            side4Folder.add( params, 'reflectivity', 0, 1, 0.01 )
                .onChange(() => {
                    material.reflectivity = params.reflectivity;
                } );
            side4Folder.add(params, "normalScaleX", 0.01, 2, 0.01).onChange((value) => {
                const y = material.normalMap.repeat.y
                material.normalMap.repeat.set(value, y)
            })
            side4Folder.add(params, "normalScaleY", 0.01, 2, 0.01).onChange((value) => {
                const x = material.normalMap.repeat.x
                material.normalMap.repeat.set(x, value)
            })

            break;


        case "frame":

            const frameFolder = gui.addFolder("Frame")

            frameFolder.add(params, "aoMapIntensity", 0.01, 1, 0.01).onChange(() => {
                material.aoMapIntensity = params.aoMapIntensity
            })

            frameFolder.add(params, "heightScale", 0.01, 4, 0.01).onChange(() => {
                material.displacementScale = params.heightScale
            })
            
            frameFolder.add( params, 'metalness', 0, 1, 0.01 )
                .onChange( function () {
                    material.metalness = params.metalness
                } );
        
            frameFolder.add( params, 'roughness', 0, 1, 0.01 )
                .onChange( function () {
                    material.roughness = params.roughness;
                } );
        
            // frameFolder.add( params, 'normalScale', 0, 1, 0.01 )
            //     .onChange( function () {
            //         material.normalScale = params.normalScale;    
            //     } );
    }
}