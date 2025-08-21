/* eslint-disable */
import { getArchivedGames } from '~/utils/archiveUtils.js';

/**
 * Calculate streak data for win/loss/draw streaks
 * @param {string} timeClass - filter by time class ('all', 'bullet', 'blitz', 'rapid', 'daily')
 * @returns {Object} streak data including current and longest streaks
 */
export function getStreakData(timeClass = "all") {
    let archivedGames = getArchivedGames();
    
    if (!archivedGames || archivedGames.length === 0) {
        return {
            currentStreak: { type: 'none', count: 0 },
            longestWinStreak: 0,
            longestLossStreak: 0,
            streakHistory: []
        };
    }

    // Filter games by time class and sort by timestamp
    let filteredGames = archivedGames.filter(game => {
        return timeClass === "all" || game.timeClass === timeClass;
    });

    // Sort games chronologically (oldest first)
    filteredGames.sort((a, b) => a.unixTimeStamp - b.unixTimeStamp);

    let currentStreak = { type: 'none', count: 0 };
    let longestWinStreak = 0;
    let longestLossStreak = 0;
    let streakHistory = [];
    
    let tempStreak = { type: 'none', count: 0 };

    for (let i = 0; i < filteredGames.length; i++) {
        let game = filteredGames[i];
        let result = game.result;
        
        let gameType = getGameType(result);
        
        if (tempStreak.type === gameType) {
            // Continue current streak
            tempStreak.count++;
        } else {
            // Streak broken, record the previous streak if it exists
            if (tempStreak.count > 0) {
                streakHistory.push({
                    type: tempStreak.type,
                    count: tempStreak.count,
                    endTimestamp: filteredGames[i-1].unixTimeStamp,
                    endDate: filteredGames[i-1].timeStamp
                });
                
                // Update longest streaks
                if (tempStreak.type === 'win' && tempStreak.count > longestWinStreak) {
                    longestWinStreak = tempStreak.count;
                }
                if (tempStreak.type === 'loss' && tempStreak.count > longestLossStreak) {
                    longestLossStreak = tempStreak.count;
                }
            }
            
            // Start new streak
            tempStreak = { type: gameType, count: 1 };
        }
    }
    
    // Handle the final streak
    if (tempStreak.count > 0) {
        streakHistory.push({
            type: tempStreak.type,
            count: tempStreak.count,
            endTimestamp: filteredGames[filteredGames.length-1].unixTimeStamp,
            endDate: filteredGames[filteredGames.length-1].timeStamp
        });
        
        // Update longest streaks
        if (tempStreak.type === 'win' && tempStreak.count > longestWinStreak) {
            longestWinStreak = tempStreak.count;
        }
        if (tempStreak.type === 'loss' && tempStreak.count > longestLossStreak) {
            longestLossStreak = tempStreak.count;
        }
        
        // Current streak is the last one
        currentStreak = tempStreak;
    }

    return {
        currentStreak,
        longestWinStreak,
        longestLossStreak,
        streakHistory,
        totalGames: filteredGames.length
    };
}

/**
 * Convert game result to game type for streak tracking
 * @param {string} result - game result
 * @returns {string} 'win', 'loss', or 'draw'
 */
function getGameType(result) {
    if (result === "win") {
        return "win";
    } else if (result === "resigned" || result === "checkmated" || result === "timeout" || result === "abandoned") {
        return "loss";
    } else if (result === "stalemate" || result === "agreed" || result === "repetition" || result === "insufficient" || result === "50mov" || result === "timevsinsufficient") {
        return "draw";
    } else {
        console.log("unknown result for streak: " + result);
        return "draw"; // default to draw for unknown results
    }
}

/**
 * Get data for streak chart visualization
 * @param {string} timeClass - filter by time class
 * @returns {Object} chart data with recent streaks for visualization
 */
export function getStreakChartData(timeClass = "all") {
    let streakData = getStreakData(timeClass);
    
    // Get last 20 streaks for chart (or all if less than 20)
    let recentStreaks = streakData.streakHistory.slice(-20);
    
    let labels = [];
    let winData = [];
    let lossData = [];
    let drawData = [];
    
    for (let i = 0; i < recentStreaks.length; i++) {
        let streak = recentStreaks[i];
        labels.push(`Streak ${i + 1}`);
        
        if (streak.type === 'win') {
            winData.push(streak.count);
            lossData.push(0);
            drawData.push(0);
        } else if (streak.type === 'loss') {
            winData.push(0);
            lossData.push(streak.count);
            drawData.push(0);
        } else {
            winData.push(0);
            lossData.push(0);
            drawData.push(streak.count);
        }
    }
    
    return {
        labels,
        winData,
        lossData,
        drawData,
        streakData
    };
}