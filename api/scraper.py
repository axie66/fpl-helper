import requests
import pickle
import datetime
import os

class FPLData(object):
    ROOT_URL         = 'https://fantasy.premierleague.com/api/bootstrap-static/'
    PLAYER_URL       = 'https://fantasy.premierleague.com/api/element-summary/{0}/'
    LOGIN_URL        = 'https://users.premierleague.com/accounts/login/'
    ME_URL           = 'https://fantasy.premierleague.com/api/me'
    PRIVATE_TEAM_URL = 'https://fantasy.premierleague.com/api/my-team/{0}'
    PUBLIC_TEAM_URL  = 'https://fantasy.premierleague.com/api/entry/{0}/'

    REMOVED_ATTRS = [
        'chance_of_playing_next_round', 'chance_of_playing_this_round',
        'cost_change_event_fall', 'cost_change_start_fall',
        'news', 'news_added', 'special', 'squad_number', 'team_code', 
        'influence_rank', 'influence_rank_type', 'creativity_rank', 
        'creativity_rank_type', 'threat_rank', 'threat_rank_type',
        'ict_index_rank', 'ict_index_rank_type'
    ]

    KEYS = [
        'code', 'cost_change_event', 'cost_change_start', 'dreamteam_count', 
        'element_type', 'ep_next', 'ep_this', 'event_points', 'first_name', 
        'form', 'id', 'in_dreamteam', 'now_cost', 'photo', 'points_per_game', 
        'second_name', 'selected_by_percent', 'status', 'team', 'total_points', 
        'transfers_in', 'transfers_in_event', 'transfers_out', 'transfers_out_event', 
        'value_form', 'value_season', 'web_name', 'minutes', 'goals_scored', 
        'assists', 'clean_sheets', 'goals_conceded', 'own_goals', 'penalties_saved', 
        'penalties_missed', 'yellow_cards', 'red_cards', 'saves', 'bonus', 'bps', 
        'influence', 'creativity', 'threat', 'ict_index'
    ]

    def __init__(self, useCache=True):
        if os.path.exists('cache.p') and useCache:
            with open('cache.p', 'rb') as cache:
                self.data = pickle.load(cache)
        else:
            self.data = self.getFPLData()
            with open('cache.p', 'wb+') as cache:
                pickle.dump(self.data, cache)
    
    def getFPLData(self):
        data = requests.get(FPLData.ROOT_URL).json()
        data.pop('game_settings')
        data.pop('phases')
        data['last_modified'] = datetime.datetime.now()
        for player in data['elements']:
            for attr in self.REMOVED_ATTRS:
                del player[attr]
        return data

    def _find(self, attr, value):
        for player in self.data['elements']:
            if player[attr] == value:
                return player

data = FPLData(useCache=False)