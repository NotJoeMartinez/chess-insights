<template>
      <InputForm @get-all-user-data="getAllUserData"/>

        <div v-if="showSpinner" class="container">
        <div class="spinner-border">
        </div>
            {{ spinnerText }}
        </div>

        <ProgBar
        v-if="showProg"
        :progress="progress"
        :games-found="gamesFound"
        />

        <div v-if="showCharts">
        <ExportData/>

        <UserOverview
        @update-user-overview="updateOverview($event)"
        :ovUserName="ovUserName"
        :ovTimeClass="ovTimeClass"
        :ovTotalGames="ovTotalGames"
        :ovWinPercentage="ovWinPercentage"
        :ovWinCount="ovWinCount"
        :ovDrawPercentage="ovDrawPercentage"
        :ovDrawCount="ovDrawCount"
        :ovLossPercentage="ovLossPercentage"
        :ovLossCount="ovLossCount"
        />

        <EloOverTime
        @update="writeEloOverTime($event)"
        :timeClass="eloTimeClass"
        />

        <OpeningGraph
        @update-time-class="openingsTimeClass = $event"
        :timeClass="openingsTimeClass"
        />


        <WinChart 
        @updateWin="winTimeClass = $event"
        :timeClass="winTimeClass"
        />

<LossChart 
@updateLoss="lossTimeClass = $event"
:timeClass="lossTimeClass"
/>

</div>

</template>