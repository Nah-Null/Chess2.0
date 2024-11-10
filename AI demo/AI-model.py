from enum import Enum
import random
from dataclasses import dataclass
from typing import List, Tuple, Optional
import math

# กำหนดประเภทของหมาก
class PieceType(Enum):
    PAWN = "PAWN"
    KNIGHT = "KNIGHT"
    BISHOP = "BISHOP"
    ROOK = "ROOK"
    QUEEN = "QUEEN"

@dataclass
class Position:
    x: int
    y: int

@dataclass
class Piece:
    piece_type: PieceType
    position: Position
    
@dataclass
class Player:
    position: Position
    hp: int
    abilities: List[str]

class ChessAI:
    def __init__(self, board_size: int = 8):
        self.board_size = board_size
        self.difficulty_level = 1  # 1-5 ตามด่าน
        
    def get_moves(self, piece: Piece) -> List[Position]:
        """คำนวณการเดินที่เป็นไปได้ของหมากแต่ละตัว"""
        moves = []
        
        if piece.piece_type == PieceType.PAWN:
            # เดินหน้า 1 ช่อง
            moves.append(Position(piece.position.x, piece.position.y + 1))
            
        elif piece.piece_type == PieceType.KNIGHT:
            knight_moves = [
                (2, 1), (2, -1), (-2, 1), (-2, -1),
                (1, 2), (1, -2), (-1, 2), (-1, -2)
            ]
            for dx, dy in knight_moves:
                new_x = piece.position.x + dx
                new_y = piece.position.y + dy
                if self._is_valid_position(new_x, new_y):
                    moves.append(Position(new_x, new_y))
                    
        elif piece.piece_type == PieceType.BISHOP:
            directions = [(1, 1), (1, -1), (-1, 1), (-1, -1)]
            moves.extend(self._get_sliding_moves(piece.position, directions))
            
        elif piece.piece_type == PieceType.ROOK:
            directions = [(0, 1), (0, -1), (1, 0), (-1, 0)]
            moves.extend(self._get_sliding_moves(piece.position, directions))
            
        elif piece.piece_type == PieceType.QUEEN:
            directions = [(0, 1), (0, -1), (1, 0), (-1, 0),
                         (1, 1), (1, -1), (-1, 1), (-1, -1)]
            moves.extend(self._get_sliding_moves(piece.position, directions))
            
        return moves

    def _get_sliding_moves(self, pos: Position, directions: List[Tuple[int, int]]) -> List[Position]:
        """คำนวณการเดินแบบเลื่อนไถล (สำหรับ Bishop, Rook, Queen)"""
        moves = []
        for dx, dy in directions:
            current_x = pos.x + dx
            current_y = pos.y + dy
            while self._is_valid_position(current_x, current_y):
                moves.append(Position(current_x, current_y))
                current_x += dx
                current_y += dy
        return moves

    def _is_valid_position(self, x: int, y: int) -> bool:
        """ตรวจสอบว่าตำแหน่งอยู่ในกระดานหรือไม่"""
        return 0 <= x < self.board_size and 0 <= y < self.board_size

    def evaluate_position(self, piece: Piece, target: Position, player: Player) -> float:
        """ประเมินความน่าสนใจของตำแหน่งเป้าหมาย"""
        score = 0.0
        
        # ระยะห่างจากผู้เล่น
        distance_to_player = self._calculate_distance(target, player.position)
        score -= distance_to_player * 10  # ยิ่งใกล้ยิ่งดี
        
        # โบนัสถ้าสามารถกินผู้เล่นได้
        if target.x == player.position.x and target.y == player.position.y:
            score += 1000
            
        # โบนัสการควบคุมพื้นที่ (ตามระดับความยาก)
        control_score = self._evaluate_position_control(target, player)
        score += control_score * self.difficulty_level
        
        # ปรับตามบทบาทของหมากแต่ละตัว
        score *= self._get_piece_role_multiplier(piece.piece_type)
        
        return score

    def _calculate_distance(self, pos1: Position, pos2: Position) -> float:
        """คำนวณระยะห่างระหว่างสองตำแหน่ง"""
        return math.sqrt((pos1.x - pos2.x)**2 + (pos1.y - pos2.y)**2)

    def _evaluate_position_control(self, position: Position, player: Player) -> float:
        """ประเมินการควบคุมพื้นที่"""
        score = 0.0
        
        # ให้คะแนนตำแหน่งที่ใกล้ศูนย์กลาง
        center_x = self.board_size / 2
        center_y = self.board_size / 2
        distance_to_center = math.sqrt((position.x - center_x)**2 + (position.y - center_y)**2)
        score += (self.board_size - distance_to_center) * 2
        
        # ให้คะแนนการปิดเส้นทางหนี
        escape_blocking_score = self._evaluate_escape_blocking(position, player)
        score += escape_blocking_score
        
        return score

    def _evaluate_escape_blocking(self, position: Position, player: Player) -> float:
        """ประเมินการปิดเส้นทางหนีของผู้เล่น"""
        score = 0.0
        
        # ตรวจสอบว่าตำแหน่งนี้ปิดกั้นเส้นทางหนีของผู้เล่นหรือไม่
        player_escape_directions = [
            (1, 0), (-1, 0), (0, 1), (0, -1),
            (1, 1), (1, -1), (-1, 1), (-1, -1)
        ]
        
        for dx, dy in player_escape_directions:
            escape_x = player.position.x + dx
            escape_y = player.position.y + dy
            if (position.x == escape_x and position.y == escape_y):
                score += 50
                
        return score

    def _get_piece_role_multiplier(self, piece_type: PieceType) -> float:
        """กำหนดตัวคูณตามบทบาทของหมากแต่ละประเภท"""
        multipliers = {
            PieceType.PAWN: 0.8,    # เดินช้า แต่มีจำนวนมาก
            PieceType.KNIGHT: 1.2,  # เคลื่อนที่แบบพิเศษ
            PieceType.BISHOP: 1.1,  # ควบคุมแนวทแยง
            PieceType.ROOK: 1.3,    # ควบคุมแนวตั้งและแนวนอน
            PieceType.QUEEN: 1.5    # แข็งแกร่งที่สุด
        }
        return multipliers.get(piece_type, 1.0)

    def choose_moves(self, pieces: List[Piece], player: Player) -> List[Position]:
        """เลือกการเดินที่ดีที่สุดสำหรับ AI ทั้ง 3 ตัว"""
        moves = []
        
        # แต่ละตัวมีบทบาทต่างกัน
        roles = ["blocker", "attacker", "supporter"]
        
        for piece, role in zip(pieces, roles):
            possible_moves = self.get_moves(piece)
            best_move = None
            best_score = float('-inf')
            
            for move in possible_moves:
                base_score = self.evaluate_position(piece, move, player)
                
                # ปรับคะแนนตามบทบาท
                if role == "blocker":
                    # เน้นการปิดเส้นทางหนี
                    base_score *= 1.5 if self._evaluate_escape_blocking(move, player) > 0 else 0.7
                elif role == "attacker":
                    # เน้นการเข้าโจมตี
                    distance_to_player = self._calculate_distance(move, player.position)
                    base_score *= 2.0 if distance_to_player <= 2 else 0.5
                else:  # supporter
                    # เน้นการควบคุมพื้นที่
                    base_score *= 1.2 if self._evaluate_position_control(move, player) > 50 else 0.8
                
                if base_score > best_score:
                    best_score = base_score
                    best_move = move
            
            moves.append(best_move if best_move else piece.position)
            
        return moves

    def set_difficulty(self, level: int):
        """ปรับระดับความยาก"""
        self.difficulty_level = max(1, min(5, level))