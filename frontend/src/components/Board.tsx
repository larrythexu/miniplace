import { useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { Grid } from "react-window"
import { BoardCell } from "./BoardCell"

export function Board() {
    const BOARD_COUNT = 10000
    const CELL_SIZE = 50
    const BOARD_ROWS = 500
    const BOARD_COLS = 20

    const [isConnected, setIsConnected] = useState(false)
    const [board, setBoard] = useState<number[]>(Array(BOARD_COUNT).fill(0))
    const socketRef = useRef<Socket | null>(null)

    function handleConnect() {
        console.log("Connected to websocket")
        setIsConnected(true)
    }

    function handleDisconnect() {
        console.log("Disconnected from websocket")
        setIsConnected(false)
    }

    function handleClick(idx: number) {
        if (!isConnected) return

        const nextColor = (board[idx] + 1) % 3

        // Update local board state
        const newBoard = [...board]
        newBoard[idx] = nextColor
        setBoard(newBoard)

        socketRef.current?.emit('update', {
            idx,
            color: nextColor
        })
    }

    useEffect(() => {
        const socket = io(import.meta.env.VITE_SERVER_URL || "http://127.0.0.1:8000")
        socketRef.current = socket
        socket.on('connect', handleConnect)
        socket.on('disconnect', handleDisconnect)

        socket.on('board', (data: ArrayBuffer) => {
            const updateArray = new Uint8Array(data)
            setBoard(Array.from(updateArray))
        })

        // Cleanup
        return () => {
            socket.off('connect')
            socket.off('disconnect')
            socket.off('board')
            socketRef.current = null
        }

    }, [])

    if (!isConnected) {
        return (
            <div className="board">
                <p>Connecting to server...</p>
            </div>
        )
    } else {
        return (
            <div className="board">
                <Grid
                    cellComponent={BoardCell}
                    cellProps={{
                        board,
                        handleClick,
                        boardCols: BOARD_COLS
                    }}
                    columnCount={BOARD_COLS}
                    columnWidth={CELL_SIZE}
                    rowCount={BOARD_ROWS}
                    rowHeight={CELL_SIZE}
                />
            </div>
        )
    }
}