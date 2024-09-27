import { render } from "@testing-library/react";
import {BrowserRouter as Router} from 'react-router-dom';
import Dish from "../dishes/Dish";

test('renders Dish', () => {
    render(
        <Router>
            <Dish />
        </Router>
    )
})