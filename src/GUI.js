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
        case "plane1":

            gui.addColor(params, "color").onChange((value) => {
                material.color = new THREE.Color(value)
                material.needsUpdate = true
            })
        
            gui.add( params, 'transmission', 0, 1, 0.01 )
                .onChange(() => {
                    material.transmission = params.transmission;
                } );
        
            gui.add( params, 'opacity', 0, 1, 0.01 )
                .onChange(() => {
                    material.opacity = params.opacity;
                } );
        
            gui.add( params, 'metalness', 0, 1, 0.01 )
                .onChange(() => {
                    material.metalness = params.metalness
                } );
        
            gui.add( params, 'roughness', 0, 1, 0.01 )
                .onChange(() => {
                    material.roughness = params.roughness;
                } );
        
            gui.add( params, 'ior', 1, 2, 0.01 )
                .onChange(() => {
                    material.ior = params.ior;
                } );
        
            gui.add( params, 'thickness', 0, 5, 0.01 )
                .onChange(() => {
                    material.thickness = params.thickness;
                } );
        
            gui.add( params, 'specularIntensity', 0, 1, 0.01 )
                .onChange(() => {
                    material.specularIntensity = params.specularIntensity;
                } );
        
            gui.addColor( params, 'specularColor' )
                .onChange(() => {
                    material.specularColor.set( params.specularColor );
                } );
        
            gui.add( params, 'transmissionResolutionScale', 0.01, 1, 0.01 )
                .name( 'transmission resolution' )
                .onChange(() => {
                    renderer.transmissionResolutionScale = params.transmissionResolutionScale;
                } );
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