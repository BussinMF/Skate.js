import { Box, OrbitControls } from '@react-three/drei'
import { Suspense } from 'react'
import { Physics, RigidBody } from '@react-three/rapier'
import Lights from './Lights.jsx'
import Skateboard from './Skateboard.jsx'
import Loader from './Loader.jsx'


export default function Experience()
{
    return <>
        <color args={[ 'lightgrey' ]} attach="background" />

        <OrbitControls makeDefault />

        <Lights />

        <Physics debug>
            <RigidBody friction={ 1 } type='fixed'>
                <Box args={[100, 100, 0.1]} material-color="darkgrey" position-y={ -0.2 } receiveShadow rotation-x={ - Math.PI * 0.5 } scale={ 1 }/>
            </RigidBody>

            <Suspense fallback={<Loader />}>
                <Skateboard />
            </Suspense>
        </Physics>

    </>
}