import styled from 'styled-components';
import { ContextReplacementPlugin } from 'webpack';
import { string } from 'prop-types';

export const DashBoardContainer = styled.div`
    height: 100%;
    display: grid;
    grid-gap: 10px;
    background-color: #fff;
    color: #444;
    margin: 20px ;
    
    @media screen and (max-width: 768px) {
        display: flex;
        flex-direction: column;
    }
`;

type BoxProps = {
    gridColumn: string,
    gridRow: string
}

export const Box = styled.div<BoxProps>`
    background-color: #444;
    color: #fff;
    padding: 20px;
    border-radius: 5px;
    grid-column: ${(props: BoxProps) => props.gridColumn};
    grid-row: ${(props: BoxProps) => props.gridRow};
`;
