import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const CharacterTonyHawk = ({boardVisibility = false, animationsObject, events}) => {

  const { scene: modelScene, nodes, materials, animations: noAnim } = useGLTF('./character/tonyhawk/tony_t_pose.glb');

  const mixer = useRef(null);

  const actionRef = [];
useEffect(()=>{
              if(noAnim.length>0){
                console.error("Please delete animations in this file.")
              }
              },[]);
  
  useEffect(()=>{
    if(Object.keys(animationsObject).length > 0 && modelScene){
       mixer.current = new THREE.AnimationMixer(modelScene);
       Object.entries(animationsObject).forEach(([animName]) => {
        animationsObject[animName].action = mixer.current.clipAction(animationsObject[animName][0]);
        })
    }
  },[animationsObject, modelScene])

  useEffect(()=>{
    Object.entries(events).forEach(([eventName, isActive]) => {
                if(isActive){ animationsObject[eventName].action.play()}
                })

                  return () => {
              if (mixer.current) {
                mixer.current.stopAllAction();
              }
            };
  },[events])



  useFrame((state, delta) => {
    if (mixer.current) { mixer.current.update(delta); }
  });


  return (
    <group dispose={null}>
      <primitive object={modelScene} />
    </group>
  )
}

useGLTF.preload('./character/tonyhawk/tonyHawk.glb');