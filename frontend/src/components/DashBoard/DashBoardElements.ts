import styled from 'styled-components';
import { ContextReplacementPlugin } from 'webpack';
import { string } from 'prop-types';

export const DashBoardContainer = styled.div`
    margin-left: auto;
    margin-right: auto;
    height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-areas: 
    "info1 game game title"
    "info2 game game chat "
    "info3 game game chat"; 
    grid-gap: 10px;
    background-color: #fff;
    color: #444;
    padding: 10px;
    
    @media screen and (max-width: 1300px) {
        grid-template-areas: 
        " info1 info2 title"
        " game game chat "
        " game game chat"; 
    }
    @media screen and (max-width: 768px) {
        height: 100%;
        display: flex;
        flex-direction: column;
    }
`;

type BoxProps = {
    gridArea: string,
    alignSelf?: string,
    bgColor?: string,
}

export const Box = styled.div<BoxProps>`
    background-color: #444;
    background-color: ${(props: BoxProps) => props.bgColor};
    border-radius: 5px;
    grid-area: ${(props: BoxProps) => props.gridArea};
    place-self: ${(props: BoxProps) => props.alignSelf};
    overflow: hidden;
`;
