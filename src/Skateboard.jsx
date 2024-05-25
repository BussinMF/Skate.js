import { useGLTF, useKeyboardControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { useState } from 'react'
import { useRef } from 'react'
import * as THREE from 'three'

export default function Skateboard() {
    const skateboardScene = useGLTF('./skateboard/aaa.gltf')
    skateboardScene.scene.children[0].name = 'skateboard'
    const skateboard = skateboardScene.scene.children[0]

    const body = useRef()
    const [subscribeKeys, getKeys] = useKeyboardControls()

    const [ smoothedCameraPosition ] = useState(() => new THREE.Vector3())
    const [ smoothedCameraTarget ] = useState(() => new THREE.Vector3())

    const speed = 0.01
    const rotationSpeed = 4
    const impulse = new THREE.Vector3()

    useFrame((state, delta) => {
        /**
         * Camera
         */
        // Skate World Pos
        const skateboardWorldPosition = new THREE.Vector3()
        skateboard.getWorldPosition(skateboardWorldPosition)

        // Skate World Quat
        const skateboardWorldQuaternion = new THREE.Quaternion()
        skateboard.getWorldQuaternion(skateboardWorldQuaternion)

        // Cam Pos Offset
        const cameraPositionOffset = new THREE.Vector3(0, 0.65, 2.25)
        cameraPositionOffset.applyQuaternion(skateboardWorldQuaternion)

        // Cam Pos
        const cameraPosition = new THREE.Vector3().addVectors(skateboardWorldPosition, cameraPositionOffset)

        // Cam Target Pos ( Skate )
        const cameraTargetPos = new THREE.Vector3().copy(skateboardWorldPosition)
        cameraTargetPos.y += 0.25

        smoothedCameraPosition.lerp(cameraPosition, 20 * delta)
        smoothedCameraTarget.lerp(cameraTargetPos, 20 * delta)

        state.camera.position.copy(smoothedCameraPosition)
        state.camera.lookAt(smoothedCameraTarget)

        /**
         * skateboard controls
         */
        const { forward, backward, leftward, rightward, jump } = getKeys()

        const bodyQuaternion = new THREE.Quaternion()
        bodyQuaternion.copy(body.current.rotation())

        const skateboardDirection = new THREE.Vector3(0, 0, -1).applyQuaternion(bodyQuaternion)

        const rotationAngle = rotationSpeed * delta

        if (forward) {
            impulse.add(skateboardDirection.clone().multiplyScalar(0.001)) * delta 
            body.current.wakeUp(true)
        }

        if (backward) {
            impulse.add(skateboardDirection.clone().multiplyScalar(-0.001)) * delta 
            body.current.wakeUp(true)
        }

        if (leftward) {
            const quaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), rotationAngle)
            bodyQuaternion.multiply(quaternion)
            body.current.setRotation(bodyQuaternion)
            body.current.wakeUp(true)
        }

        if (rightward) {
            const quaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -rotationAngle)
            bodyQuaternion.multiply(quaternion)
            body.current.setRotation(bodyQuaternion)
            body.current.wakeUp(true)
        }

        body.current.applyImpulse(impulse)
        // body.current.setLinearDamping(1)
    })

    return (
        <RigidBody ref={body} type='dynamic' colliders={false} position-y={0.5} position-x={2} friction={1} mass={ 5 }>
            <CuboidCollider args={[0.09, 0.06, 0.38]} />
            <primitive object={skateboard} position-y={-0.06} />
        </RigidBody>
    )
}
