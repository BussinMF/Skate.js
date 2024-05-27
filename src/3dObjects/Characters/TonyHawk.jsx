import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const CharacterTonyHawk = ({boardVisibility = false}) => {

  const { scene: modelScene, nodes, materials } = useGLTF('./character/tonyhawk/tony_t_pose.glb');
  const { animations } = useGLTF('./character/animations/FE_Main_Idle_BoardSpin.glb');

  const mixer = useRef(null);
  const actions = useRef({});

  const actionRef = [];

  useEffect(() => {
    if (animations && modelScene) {
      mixer.current = new THREE.AnimationMixer(modelScene);

      animations.forEach((clip) => {
                                        const action = mixer.current.clipAction(clip);
                                        actionRef.push(action) // Les ajouter dans un tableau referencé plutot
                                        console.log(clip.name) //liste les actions pour supprimer celless inutiles
                                        actions.current[clip.name] = action;
                                        //action.play();
                                      });
                                      actionRef[2].play(); //A appeler lors des events
                                    }

    return () => {
      if (mixer.current) {
        mixer.current.stopAllAction();
      }
    };
  }, [animations, modelScene]);


  useFrame((state, delta) => {
    if (mixer.current) {
      mixer.current.update(delta);
    }
  });


  return (
    <group dispose={null}>
      <primitive object={modelScene} />
    </group>
  )
}

useGLTF.preload('./character/tonyhawk/tonyHawk.glb');
useGLTF.preload('./character/animations/FE_Main_Idle_BoardSpin.glb');

