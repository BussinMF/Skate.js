import { useGLTF, useKeyboardControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { CuboidCollider, RigidBody, useRapier } from '@react-three/rapier'
import { useState, useRef, useEffect } from 'react'
import * as THREE from 'three'

export default function Skateboard() {
    const skateboardScene = useGLTF('./skateboard/aaa.gltf')
    skateboardScene.scene.children[0].name = 'skateboard'
    const skateboard = skateboardScene.scene.children[0]

    const body = useRef()
    const [subscribeKeys, getKeys] = useKeyboardControls()
    const { rapier, world } = useRapier()

    const jump = () =>
    {
        const origin = body.current.translation()
        const direction = { x: 0, y: - 1, z: 0 }
        const ray = new rapier.Ray(origin, direction)
        const hit = world.castRay(ray, 10, true)
        // hit.solid = true
        if(hit.toi < 0.15)
        {
            body.current.applyImpulse({ x: 0, y: 0.1, z: 0 })
        }
        console.log(hit.toi)
    }

    useEffect(() =>
    {
        subscribeKeys(
            // Selector
            (state) => state.jump,
            // Call Function
            (value) =>
            {
                if(value)
                {
                    jump()
                }
            }
        )
    }, [])

    const [smoothedCameraPosition] = useState(() => new THREE.Vector3())
    const [smoothedCameraTarget] = useState(() => new THREE.Vector3())

    let currentSpeed = 0
    const maxSpeed = 10
    const acceleration = 0.05
    const deceleration = 0.03
    const rotationSpeed = 3
    
    const impulse = new THREE.Vector3()

    useFrame((state, delta) => {
        /**
         * Camera
         */
        const skateboardWorldPosition = new THREE.Vector3()
        skateboard.getWorldPosition(skateboardWorldPosition)

        const skateboardWorldQuaternion = new THREE.Quaternion()
        skateboard.getWorldQuaternion(skateboardWorldQuaternion)

        const cameraPositionOffset = new THREE.Vector3(0, 0.65, 2.25)
        cameraPositionOffset.applyQuaternion(skateboardWorldQuaternion)

        const cameraPosition = new THREE.Vector3().addVectors(skateboardWorldPosition, cameraPositionOffset)

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

        if (forward) {
            currentSpeed = Math.min(currentSpeed + acceleration * delta * 60, maxSpeed)
        } else if (backward) {
            currentSpeed = Math.max(currentSpeed - acceleration * delta * 60, -maxSpeed / 2)
        } else {
            if (currentSpeed > 0) {
                currentSpeed = Math.max(currentSpeed - deceleration * delta * 60, 0)
            } else if (currentSpeed < 0) {
                currentSpeed = Math.min(currentSpeed + deceleration * delta * 60, 0)
            }
        }

        if (leftward) {
            bodyQuaternion.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), rotationSpeed * delta))
        }

        if (rightward) {
            bodyQuaternion.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -rotationSpeed * delta))
        }

        body.current.setRotation(bodyQuaternion)
        impulse.copy(skateboardDirection).multiplyScalar(currentSpeed)
        body.current.setLinvel({ x: impulse.x, y: body.current.linvel().y, z: impulse.z })
        body.current.setLinearDamping(1)
    })

    return (
        <RigidBody ref={body} type='dynamic' colliders={false} position-y={0.5} position-x={2} friction={1} mass={5}>
            <CuboidCollider args={[0.09, 0.06, 0.38]} />
            <primitive object={skateboard} position-y={-0.06} />
        </RigidBody>
    )
}
