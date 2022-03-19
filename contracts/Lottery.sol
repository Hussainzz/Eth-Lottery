//SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;


import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "./LotteryData.sol";

contract Lottery is VRFConsumerBaseV2{
    VRFCoordinatorV2Interface COORDINATOR;
    LinkTokenInterface LINKTOKEN;
    LotteryData LOTTERY_DATA;

    using Counters for Counters.Counter;

    using SafeMath for uint256;

    Counters.Counter private lotteryId;

    uint public totalAllowedPlayers = 10;
    //mapping(address => bool) private activeLotteryPlayers;

    address public lotteryManager;

    mapping(uint256 => uint256) private lotteryRandomnessRequest;
    bytes32 private keyHash;
    uint64 immutable s_subscriptionId;
    uint16 immutable requestConfirmations = 3;
    uint32 immutable callbackGasLimit = 100000;
    uint256 public s_requestId;

    event RandomnessRequested(uint256,uint256);
    
    //To emit data which will contain the requestId-from chainlink vrf, lotteryId, winnder address
    event WinnerDeclared(uint256 ,uint256,address);

    //To emit data which will contain the lotteryId, address of new-player & new Price Pool
    event NewLotteryPlayer(uint256, address, uint256);

    //To emit data which will contain the id of newly created lottery
    event LotteryCreated(uint256);

     constructor(
        bytes32 _keyHash,
        uint64 subscriptionId, 
        address _vrfCoordinator, 
        address _link,
        address _lotteryData
        ) VRFConsumerBaseV2(_vrfCoordinator){
        lotteryId.increment();   
        lotteryManager = msg.sender;
        COORDINATOR = VRFCoordinatorV2Interface(_vrfCoordinator);
        LINKTOKEN = LinkTokenInterface(_link);
        s_subscriptionId = subscriptionId;
        keyHash = _keyHash;
        LOTTERY_DATA = LotteryData(_lotteryData);
    }

    modifier onlyLotteryManager {
        require(msg.sender == lotteryManager, "only_lottery_manager_allowed");
        _;
    }

    function getAllLotteryIds() public view returns(uint256[] memory){
        return LOTTERY_DATA.getAllLotteryIds();
    }

    function updateTotalPlayersAllowed(uint256 _c) public onlyLotteryManager{
        require(_c != 0 , "action_not_allowed_value_zero");
        require(_c != totalAllowedPlayers, "action_not_allowed");
        totalAllowedPlayers = _c;
    }

    function getLotteryPlayers(uint256 _lotteryId) public view returns(address[] memory){
       return LOTTERY_DATA.getLotteryPlayers(_lotteryId);
    }

    function startLottery() public payable onlyLotteryManager {
        LOTTERY_DATA.addLotteryData(lotteryId.current());
        lotteryId.increment();
        emit LotteryCreated(lotteryId.current());
    }

    function enterLottery(uint256 _lotteryId) public payable {
        (uint256 lId, 
        uint256 ticketPrice, 
        uint256 prizePool, 
        address[] memory players, 
        address winner, 
        bool isFinished) = LOTTERY_DATA.getLottery(_lotteryId);

        require(!isFinished, "lottery_not_active");
        require(players.length < totalAllowedPlayers, "lottery_full");
        //require(activeLotteryPlayers[msg.sender], "duplicate_entry");
        require(msg.value >= ticketPrice, "invalid_entry_fee");

        uint256  updatedPricePool = prizePool + msg.value;
        LOTTERY_DATA.addPlayerToLottery(_lotteryId, updatedPricePool, msg.sender);
        emit NewLotteryPlayer(_lotteryId, msg.sender, updatedPricePool);
    }

    function pickWinner(uint256 _lotteryId) public onlyLotteryManager {

        require(!LOTTERY_DATA.isLotteryFinished(_lotteryId),"lottery_ended");

        address[] memory p = LOTTERY_DATA.getLotteryPlayers(_lotteryId);
        if(p.length == 1) {
            require(p[0] != address(0), "no_players_found");
            LOTTERY_DATA.setWinnerForLottery(_lotteryId, 0);
            payable(p[0]).transfer(address(this).balance);
            emit WinnerDeclared(0,_lotteryId,p[0]);
        } else {
            //LINK is from VRFConsumerBase
            s_requestId = COORDINATOR.requestRandomWords(
                keyHash,
                s_subscriptionId,
                requestConfirmations,
                callbackGasLimit,
                1 // number of random numbers
            );
            lotteryRandomnessRequest[s_requestId] = _lotteryId;
            emit RandomnessRequested(s_requestId,_lotteryId);
        }
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomness) internal override {
        uint256 _lotteryId = lotteryRandomnessRequest[requestId];
        address[] memory allPlayers = LOTTERY_DATA.getLotteryPlayers(_lotteryId);
        uint256 winnerIndex = randomness[0].mod(allPlayers.length);
        LOTTERY_DATA.setWinnerForLottery(_lotteryId, winnerIndex);
        delete lotteryRandomnessRequest[requestId];
        payable(allPlayers[winnerIndex]).transfer(address(this).balance);
        emit WinnerDeclared(requestId,_lotteryId,allPlayers[winnerIndex]);
    }
}

