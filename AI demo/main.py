# ตัวอย่างการใช้งาน
ai = ChessAI()
ai.set_difficulty(1)  # ตั้งค่าความยาก

# สร้างข้อมูลสถานะเกม
player = Player(Position(4, 7), hp=3, abilities=[])
ai_pieces = [
    Piece(PieceType.PAWN, Position(1, 1)),
    Piece(PieceType.KNIGHT, Position(3, 1)),
    Piece(PieceType.ROOK, Position(6, 1))
]

# AI ตัดสินใจเดิน
moves = ai.choose_moves(ai_pieces, player)