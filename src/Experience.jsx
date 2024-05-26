import { Box, OrbitControls } from '@react-three/drei'
import Lights from './Lights.jsx'
import Skateboard from './Skateboard.jsx'
import Skatepark from './Skatepark.jsx'
import Loader from './Loader.jsx'
import { Suspense } from 'react'
import { Physics, RigidBody } from '@react-three/rapier'


export default function Experience()
{
    return <>
        <color args={[ 'lightgrey' ]} attach="background" />

        <OrbitControls makeDefault />

        <Lights />

        <Box position-x={ 1 } position-z={ 1 } />

        <Physics debug>
            <RigidBody friction={ 1 }>
                <mesh position-y={ -0.2 } receiveShadow rotation-x={ - Math.PI * 0.5 } scale={ 100 }>
                    <planeGeometry />
                    <meshStandardMaterial color="black" />
                </mesh>
            </RigidBody>

            <Suspense fallback={<Loader />}>
                <Skateboard />
                {/* <Skatepark /> */}
            </Suspense>
        </Physics>

    </>
}