// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ExpenseTracker {
    address public owner;
    uint256 public expenseId;

    struct Dutch {
        uint256 id;
        address creator;
        string name;
        string description;
        uint256 amount;
        bool settled;
        address[] members;
    }

    mapping(uint256 => Dutch) public expenses;

    event ExpenseCreated(uint256 id, address creator, string name, string description, uint256 amount);
    event MemberAdded(uint256 expenseId, address member);
    event ContributionMade(uint256 indexed expenseId, address contributor, uint256 amount);


    modifier onlyOwner() {
        require(msg.sender == owner, "Only contract owner can perform this action");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function createExpense(string memory _name, string memory _description, uint256 _amount, address[] memory _members) external {
        require(_amount > 0, "Amount must be greater than zero");
        require(_members.length > 0, "Expense must have at least one member");

        expenses[expenseId] = Dutch(expenseId, msg.sender, _name, _description, _amount, false, _members);
        emit ExpenseCreated(expenseId, msg.sender, _name, _description, _amount);

        for (uint256 i = 0; i < _members.length; i++) {
            emit MemberAdded(expenseId, _members[i]);
        }

        expenseId++;
    }

    function addMember(uint256 _expenseId, address _member) external onlyOwner {
        expenses[_expenseId].members.push(_member);
        emit MemberAdded(_expenseId, _member);
    }
   function isMember(uint256 _expenseId, address _address) public view returns (bool) {
    for (uint256 i = 0; i < expenses[_expenseId].members.length; i++) {
        if (expenses[_expenseId].members[i] == _address) {
            return true;
        }
    }
    return false;
    }

    function contributeToExpense(uint256 _expenseId, uint256 _amount) public payable {
    // Check if the caller is a member of the expense
    require(isMember(_expenseId, msg.sender), "Caller is not a member of the expense");

    // Ensure that a non-zero amount is contributed
    require(_amount > 0, "Contribution amount must be greater than zero");

    // Ensure that the sent value matches the specified amount
    // require(msg.value == _amount, "Sent value does not match the specified amount");

    // Update the expense amount with the contribution
    expenses[_expenseId].amount += _amount;

    // Emit an event indicating the contribution
    emit ContributionMade(_expenseId, msg.sender, _amount);
    }

}
