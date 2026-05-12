<?php

namespace App\Enums;

enum RequestStatus: string
{
    case Open = 'open';
    case InReview = 'in_review';
    case InProgress = 'in_progress';
    case WaitingResponse = 'waiting_response';
    case Resolved = 'resolved';
    case Cancelled = 'cancelled';

    /**
     * @return array<int, string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    public function label(): string
    {
        return match ($this) {
            self::Open => 'Aberta',
            self::InReview => 'Em análise',
            self::InProgress => 'Em andamento',
            self::WaitingResponse => 'Aguardando retorno',
            self::Resolved => 'Resolvida',
            self::Cancelled => 'Cancelada',
        };
    }
}
