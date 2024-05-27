import { useGLTF, useKeyboardControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { CuboidCollider, CylinderCollider, RigidBody, useRapier } from '@react-three/rapier'
import { useState, useRef, useEffect } from 'react'
import * as THREE from 'three'

export default function Skateboard() {
    const skateboardScene = useGLTF('./skateboard/skateboard.glb')
    const skateboard = skateboardScene.scene

    const body = useRef()
    const [subscribeKeys, getKeys] = useKeyboardControls()
    const { rapier, world } = useRapier()

    const [smoothedCameraPosition] = useState(() => new THREE.Vector3())
    const [smoothedCameraTarget] = useState(() => new THREE.Vector3())

    let currentSpeed = 0
    const maxSpeed = 10
    const acceleration = 0.05
    const deceleration = 0.03
    const rotationSpeed = 3

    const [isInAir, setIsInAir ] = useState(true)
    
    const impulse = new THREE.Vector3()

    const jump = () => {
        const origin = body.current.translation()
        const direction = { x: 0, y: -1, z: 0 }
        const ray = new rapier.Ray(origin, direction)
        const hit = world.castRay(ray, 10, true)
        if (hit.toi < 0.15) {
            body.current.applyImpulse({ x: 0, y: 0.03, z: 0 })
        }
    }

    const resetRotation = () => {
        const rot = new THREE.Quaternion(0.000008254258318629581, 8.795246344561747e-7, 8.795246344561747e-7, 1)
        const currentRotation = body.current.rotation()
        if (!rot.equals(currentRotation)) {
            body.current.setRotation(rot)
        }
    }

    const kickFlip = () => {
        if (isInAir) {
            console.log('Performing kickflip')
            body.current.applyTorqueImpulse({ x: 0, y: 0, z: -0.0004 })
        } else {
            console.log('Cannot kickflip: not in air')
        }
    }

    useEffect(() => {
        const unsubscribeJump = subscribeKeys(
            (state) => state.jump,
            (value) => {
                if (value) {
                    jump()
                }
            }
        )
        const unsubscribeResetRotation = subscribeKeys(
            (state) => state.resetRotation,
            (value) => {
                if (value) {
                    resetRotation()
                }
            }
        )
        const unsubscribeKickFlip = subscribeKeys(
            (state) => state.kickFlip,
            (value) => {
                if (value) {
                    kickFlip()
                }
            }
        )

        return () => {
            unsubscribeJump()
            unsubscribeResetRotation()
            unsubscribeKickFlip()
        }
    }, [])

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
        const { forward, backward, leftward, rightward, jump, kickFlip } = getKeys()

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

        if (jump || kickFlip) {
            body.current.wakeUp()
        }

        body.current.setRotation(bodyQuaternion)
        impulse.copy(skateboardDirection).multiplyScalar(currentSpeed)
        body.current.setLinvel({ x: impulse.x, y: body.current.linvel().y, z: impulse.z })
        body.current.setLinearDamping(1)
    })

    return (
        <RigidBody 
            ref={body} 
            type='dynamic' 
            colliders={false} 
            friction={1} 
            onCollisionEnter={() => {
                console.log("Collision Enter - Grounded");
                setIsInAir(false);
            }}
            onCollisionExit={() => {
                console.log("Collision Exit - In Air");
                setIsInAir(true);
            }}
        >
            <CuboidCollider args={[0.09, 0.018, 0.38]} position={[0, 0.045, 0]} />
            <CylinderCollider args={[0.017, 0.028]} rotation={[Math.PI * 0.5, 0, Math.PI * 0.5]} position={[0.073, -0.028, 0.218]} /> 
            <CylinderCollider args={[0.017, 0.028]} rotation={[Math.PI * 0.5, 0, Math.PI * 0.5]} position={[-0.073, -0.028, 0.218]} /> 
            <CylinderCollider args={[0.017, 0.028]} rotation={[Math.PI * 0.5, 0, Math.PI * 0.5]} position={[0.073, -0.028, -0.218]} /> 
            <CylinderCollider args={[0.017, 0.028]} rotation={[Math.PI * 0.5, 0, Math.PI * 0.5]} position={[-0.073, -0.028, -0.218]} /> 
            <primitive object={skateboard} position-y={-0.055} />
        </RigidBody>
    )
}
