import { useAnimations, useGLTF } from '@react-three/drei';
import React, { useRef } from 'react';

export const CharacterTonyHawk = ({boardVisibility = false}) => {

  const { nodes, materials } = useGLTF('./character/tonyhawk/tony_t_pose.glb');
  const { nodes: idleNodes, animations: idleAnimations } = useGLTF('./character/animations/FE_Main_Idle_BoardSpin.glb');
  const group = useRef();
  const allAnimations = [ ...idleAnimations];
  const { actions } = useAnimations(allAnimations, group);

  React.useEffect(() => {
    console.log(nodes)
    Object.keys(actions).forEach(action => {
      actions[action].play();
    });
  }, [actions]);

  return (
    <group ref={group} dispose={null}>

      <group name='skateboard' visible={boardVisibility}>
            <skinnedMesh
              geometry={nodes['0000_TonyHawk'].geometry}
              material={materials.deck_material}
              skeleton={nodes['0000_TonyHawk'].skeleton}
            />
            <skinnedMesh
              geometry={nodes['0001_TonyHawk'].geometry}
              material={materials.truck_material}
              skeleton={nodes['0001_TonyHawk'].skeleton}
            />
      </group>

      <group name='character'>
            <skinnedMesh
              geometry={nodes['0002_TonyHawk'].geometry}
              material={materials.eye_material}
              skeleton={nodes['0002_TonyHawk'].skeleton}
            />
            <skinnedMesh
              geometry={nodes['0003_TonyHawk'].geometry}
              material={materials.Tony_hair_material}
              skeleton={nodes['0003_TonyHawk'].skeleton}
            />
            <skinnedMesh
              geometry={nodes['0004_TonyHawk'].geometry}
              material={materials.clothes_material}
              skeleton={nodes['0004_TonyHawk'].skeleton}
            />
            <skinnedMesh
              geometry={nodes['0005_TonyHawk'].geometry}
              material={materials['teeth_material.002']}
              skeleton={nodes['0005_TonyHawk'].skeleton}
            />
            <skinnedMesh
              geometry={nodes['0006_TonyHawk'].geometry}
              material={materials.tony_hawk_skin}
              skeleton={nodes['0006_TonyHawk'].skeleton}
            />
            <skinnedMesh
              geometry={nodes['0007_TonyHawk'].geometry}
              material={materials.clothes2_alt_material}
              skeleton={nodes['0007_TonyHawk'].skeleton}
            />
      </group>

    </group>
  )
}

useGLTF.preload('./character/tonyhawk/tonyHawk.glb');
useGLTF.preload('./character/animations/FE_Main_Idle_BoardSpin.glb');

