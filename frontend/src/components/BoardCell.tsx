import { type CellComponentProps } from "react-window";

interface CellData {
    board: number[]
    handleClick: (idx: number) => void
    boardCols: number
}

export function BoardCell({
    board,
    handleClick,
    boardCols,
    columnIndex,
    rowIndex,
    style
}: CellComponentProps<CellData>) {
    const idx = rowIndex * boardCols + columnIndex
    const colorString = board[idx] === 0 ? 'red' : board[idx] === 1 ? 'blue' : 'green'

    return (
        <div
            className="board-cell"
            style={{ ...style, backgroundColor: colorString }}
            onClick={() => handleClick(idx)}
        />
    )
}
