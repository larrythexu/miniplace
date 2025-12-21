from flask import Flask, jsonify, request
from flask_socketio import SocketIO
import numpy as np

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")


# Store the state of our board
# 0 = Red
# 1 = Blue
# 2 = Green
board = np.zeros([100], dtype=np.uint8)
EMIT_DELAY = 10


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
    reqIdx = data['idx']
    reqColor = data['color']
    board[int(reqIdx)] = int(reqColor)


def background_emit():
    while True:
        socketio.sleep(EMIT_DELAY)
        socketio.emit('board', board.tobytes())


if __name__ == '__main__':
    socketio.start_background_task(background_emit)
    socketio.run(app, debug=True)
