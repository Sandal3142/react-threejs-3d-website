import React,{useEffect,useRef} from "react"; 
import * as THREE from "three"
import { Canvas,useThree } from "@react-three/fiber";
import { OrbitControls,useGLTF ,useTexture,useAnimations} from "@react-three/drei";
import { normalMap, PI, texture } from "three/tsl";
// import { normalMap } from "three/tsl";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
const Dog =() => {

    gsap.registerPlugin(useGSAP())
    gsap.registerPlugin(ScrollTrigger)

    const model = useGLTF("/models/dog.drc.glb")
     useThree(({camera,scene,gl}) =>{
        // console.log(camera.position)
        camera.position.z=0.59
        camera.position.x=-0.1
        camera.position.y=0
        gl.toneMapping= THREE.ReinhardToneMapping
        gl.outputColorSpace = THREE.SRGBColorSpace
     }
    )
    const{actions}=useAnimations(model.animations,model.scene)
    useEffect(()=>{
        actions["Take 001"].play()
    }, [actions])
   
    const[normalMap] = (useTexture(["/dog_normals.jpg",]))
    .map(texture=>{
        texture.flipY= false
        texture.colorSpace=THREE.SRGBColorSpace
        return texture
    })
    const [ branchMap,branchNormalMap ]= (useTexture(["/branches_diffuse.jpeg","/branches_normals.jpeg"]))
      .map(texture=>{
        texture.colorSpace=THREE.SRGBColorSpace
        return texture
    })
        const[
            mat1,
            mat2,
            mat3,
            mat4,
            mat5,
            mat6,
            mat7,
            mat8,
            mat9,
            mat10,
            mat11,
            mat12,
            mat13,
            mat14,
            mat15,
            mat16,
            mat17,
            mat18,
            mat19,
            mat20,
            
        ]=(useTexture([
         "/matcap/mat-1.jpg",
         "/matcap/mat-2.jpg",
         "/matcap/mat-3.jpg",
         "/matcap/mat-4.jpg",
         "/matcap/mat-5.jpg",
         "/matcap/mat-6.jpg",
         "/matcap/mat-7.jpg",
         "/matcap/mat-8.jpg",
         "/matcap/mat-9.jpg",
         "/matcap/mat-10.jpg",
         "/matcap/mat-11.jpg",
         "/matcap/mat-12.jpg",
         "/matcap/mat-13.jpg",
         "/matcap/mat-14.jpg",
         "/matcap/mat-15.jpg",
         "/matcap/mat-16.jpg",
         "/matcap/mat-17.jpg",
         "/matcap/mat-18.jpg",
         "/matcap/mat-19.jpg",
         "/matcap/mat-20.jpg",
         

        ])).map(texture=>{
        texture.colorSpace=THREE.SRGBColorSpace
        return texture
    })
        
       const material = useRef({
        uMatcap1:{value:mat19},
        uMatcap2:{value:mat2},
        uProgress:{value:1.0}
       })
    
     const dogmaterial = new THREE.MeshMatcapMaterial({
              normalMap:normalMap,
              
              matcap:mat2
     })
     const branchMaterial = new THREE.MeshMatcapMaterial({
    normalMap:branchNormalMap,
    matcap:branchMap
})
      function onBeforeCompile(shader){
    shader.uniforms.uMatcapTexture1 = material.current.uMatcap1
        shader.uniforms.uMatcapTexture2 = material.current.uMatcap2
        shader.uniforms.uProgress = material.current.uProgress

        // Store reference to shader uniforms for GSAP animation

        shader.fragmentShader = shader.fragmentShader.replace(
            "void main() {",
            `
        uniform sampler2D uMatcapTexture1;
        uniform sampler2D uMatcapTexture2;
        uniform float uProgress;

        void main() {
        `
        )

        shader.fragmentShader = shader.fragmentShader.replace(
            "vec4 matcapColor = texture2D( matcap, uv );",
            `
          vec4 matcapColor1 = texture2D( uMatcapTexture1, uv );
          vec4 matcapColor2 = texture2D( uMatcapTexture2, uv );
          float transitionFactor  = 0.2;
          
          float progress = smoothstep(uProgress - transitionFactor,uProgress, (vViewPosition.x+vViewPosition.y)*0.5 + 0.5);

          vec4 matcapColor = mix(matcapColor2, matcapColor1, progress );
        `
        )
    }


dogmaterial.onBeforeCompile= onBeforeCompile
dogmaterial.needsUpdate = true


     model.scene.traverse((child)=>{
        if (child.isMesh){
        if(child.name.includes("DOG")){
            child.material = dogmaterial
    } else{
        child.material=branchMaterial
    }}
     })

      const dogmodel = useRef(model)


         

    useGSAP(()=>{

      const tl=gsap.timeline({
        scrollTrigger:{
        trigger:"#section-1",
        endTrigger:"#section-3",
        start:"top top",
        end:"bottom bottom",
        marker:true,
        scrub:true,

        },
      })
      tl.to(dogmodel.current.scene.position,{
        z:"-=0.75",
        y:-0.25
      })
      .to(dogmodel.current.scene.rotation,{
        x: (Math.PI/15)
      })
      .to(dogmodel.current.scene.rotation,{
        y:-Math.PI
      },"third")
      .to(dogmodel.current.scene.position,{
        x:-0.2,
        y:-0.4,
        z:-0.3
      },"third")
    },[])
   useEffect(() => {

  const animateMaterial = (mat) => {
    material.current.uMatcap1.value = mat

    gsap.to(material.current.uProgress, {
      value: 0,
      duration: 0.3,
      onComplete: () => {
        material.current.uMatcap2.value = mat
        material.current.uProgress.value = 1
      }
    })
  }

  const titles = document.querySelectorAll(".title")

  titles.forEach((title) => {

    title.addEventListener("mouseenter", () => {
      const name = title.getAttribute("img-title")

      const matMap = {
        "tomorrowland": mat19,
        "navy-pier": mat8,
        "msi-chicago": mat9,
        "phone": mat12,
        "kikk": mat10,
        "kennedy": mat8,
        "opera": mat13
      }

      animateMaterial(matMap[name])
    })

    title.addEventListener("mouseleave", () => {
      animateMaterial(mat2)
    })

  })

}, [])



    return(
    <>
    <primitive object={model.scene} position={[0.08,-0.55,0]} rotation={[0,Math.PI/3.9,0]} />
    <directionalLight position={[0,5,5]} color={0xFFFFFF} intensity={10}/>
     
 </>
    )
}
 export default Dog