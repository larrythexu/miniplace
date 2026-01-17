from flask import Flask, jsonify, request
from flask_socketio import SocketIO
import numpy as np
import eventlet

# Async model for socketio
eventlet.monkey_patch()

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode="eventlet")

# Store the state of our board
# 0 = Red
# 1 = Blue
# 2 = Green
board = np.zeros([10000], dtype=np.uint8)
EMIT_DELAY = 5


# RESTAPI - slow
# Get board state
@app.route('/api/board')
def get_board():
    return jsonify(board.tolist())


# Set Board Idx
@app.route('/api/board', methods=["POST"])
def set_board_idx():
    reqColor = request.form['color']
    reqIdx = request.form['idx']

    board[int(reqIdx)] = int(reqColor)

    return 'OK', 200


# SocketIO
# Receive update from client
@socketio.on("update")
def update_board(data):
    reqIdx = data.get('idx', None)
    reqColor = data.get('color', None)

    if reqIdx is None or reqColor is None:
        return

    board[int(reqIdx)] = int(reqColor)
    print("Updated board at index", reqIdx, "to color", reqColor)


@socketio.on("connect")
def on_connect():
    print("Client connected")
    socketio.emit("board", board.tobytes())


@socketio.on("disconnect")
def on_disconnect():
    print("Client disconnected")


def background_emit():
    while True:
        socketio.sleep(EMIT_DELAY)
        socketio.emit('board', board.tobytes())
        # print("Emitting!")


# Start emission when app inits
socketio.start_background_task(background_emit)

if __name__ == '__main__':
    socketio.run(app, debug=True)
