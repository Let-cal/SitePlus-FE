import * as React from 'react'
import { Header } from '../../all-site/Header'
import { Footer } from '../../all-site/Footer'
import { Divider } from "../../all-site/divider";
import About from '../components/About'
import Ability from '../components/Ability'
import Expert from '../components/Expert'
import People from '../components/People';
import Benefit from '../components/Benefit';

function InfoPage() {
    return (
        <div>
            <Header />
            <About />
            <Divider />

            <Ability />
            <Divider />

            <Expert />
            <Divider />

            <People />
            <Divider />

            <Benefit/>

            <Footer />

        </div>
    )
}

export default InfoPage