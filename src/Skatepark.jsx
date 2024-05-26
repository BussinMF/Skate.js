import { useGLTF, useKeyboardControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { CuboidCollider, RigidBody, useRapier } from '@react-three/rapier'
import { useState, useRef, useEffect } from 'react'
import * as THREE from 'three'

export default function Skatepark() {
    const skateparkScene = useGLTF('./skatepark/scene.gltf')
    
    return (
        <>
            <primitive object={skateparkScene.scene} />
        </>
    )
}
