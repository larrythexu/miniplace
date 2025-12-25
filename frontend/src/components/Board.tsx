import { useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";

export function Board() {
    const BOARD_COUNT = 100

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
        const socket = io()
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

    return (
        <div className="board">
            {board.map((color, idx) => {
                const colorString = color === 0 ? 'red' : color === 1 ? 'blue' : 'green'

                return (
                    <div
                        key={idx}
                        className="board-cell"
                        style={{ backgroundColor: colorString }}
                        onClick={() => handleClick(idx)}
                    />
                )
            })}
        </div>
    )
}