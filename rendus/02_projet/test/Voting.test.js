const Voting = artifacts.require('Voting');
const { BN, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');

contract('Voting', accounts => {
    const _owner = accounts[0];
    const _voter1 = accounts[1];
    const _voter2 = accounts[2];

    let VotingInstance;

    beforeEach(async() => {
        VotingInstance = await Voting.new({ from : _owner });
    });

    // ::::::::::::: GETTERS ::::::::::::: //

    context('\n✨ CONTEXT: Testing getters when WorkflowStatus == RegisteringVoters\n', () => {
        beforeEach(async() => {
            // Add _voter1 as a Voter
            await VotingInstance.addVoter(_voter1, { from: _owner });
        });

        describe('• Get voter', () => {
            it('should return Voter of the provided address', async() => {
                const receipt = await VotingInstance.getVoter(_voter1, { from: _voter1 });
                
                expect(receipt.isRegistered).to.be.true;
                expect(receipt.hasVoted).to.be.false;
                expect(receipt.votedProposalId).to.be.bignumber.equal(BN(0));
            });
    
            it('should return a non Voter of the provided address (isRegistered == false)', async() => {
                const receipt = await VotingInstance.getVoter(_voter2, { from: _voter1 });
                
                expect(receipt.isRegistered).to.be.false;
                expect(receipt.hasVoted).to.be.false;
                expect(receipt.votedProposalId).to.be.bignumber.equal(BN(0));
            });
    
            it('should revert (You\'re not a voter)', async() => {
                await expectRevert(
                    VotingInstance.getVoter(_voter1, { from: _owner }),
                    'You\'re not a voter'
                );
            });
        });

        describe('• Get one proposal', () => {
            it('should revert (You\'re not a voter)', async() => {
                await expectRevert(
                    VotingInstance.getOneProposal(_voter1, { from: _owner }),
                    'You\'re not a voter'
                );
            });

            it('should revert (there is no proposal during this context)', async() => {
                await expectRevert.unspecified(VotingInstance.getOneProposal(BN(0), { from: _voter1 }));
            });

            it('should get winningProposalID', async() => {
                const winningProposalID = await VotingInstance.winningProposalID();
                expect(winningProposalID).to.be.bignumber.equal(BN(0));
            });
        });
    });

    context('\n✨ CONTEXT: Testing getters when WorkflowStatus == ProposalsRegistrationStarted\n', () => {
        beforeEach(async() => {
            // Add _voter1 as a Voter
            await VotingInstance.addVoter(_voter1, { from: _owner });
            // Start Proposals Registering
            await VotingInstance.startProposalsRegistering({ from: _owner });
        });

        describe('• Get voter', () => {
            it('should return Voter of the provided address', async() => {
                const receipt = await VotingInstance.getVoter(_voter1, { from: _voter1 });
    
                expect(receipt.isRegistered).to.be.true;
                expect(receipt.hasVoted).to.be.false;
                expect(receipt.votedProposalId).to.be.bignumber.equal(BN(0));
            });            
        });

        describe('• Get one proposal', () => {
            beforeEach(async() => {
                // Add a second proposal (Proposal[0] is set by startProposalsRegistering)
                await VotingInstance.addProposal('Proposition 1', { from: _voter1 });
            });

            it('should return Proposal of the id 0', async() => {
                const receipt = await VotingInstance.getOneProposal(BN(0), { from: _voter1 });
    
                expect(receipt.description, 'GENESIS');
                expect(receipt.voteCount, BN(0));
            });

            it('should return Proposal of the id 1', async() => {
                const receipt = await VotingInstance.getOneProposal(BN(1), { from: _voter1 });
    
                expect(receipt.description, 'Proposition 1');
                expect(receipt.voteCount, BN(0));
            });

            it('should revert (You\'re not a voter)', async() => {
                await expectRevert(
                    VotingInstance.getOneProposal(_voter1, { from: _owner }),
                    'You\'re not a voter'
                );
            });

            it('should revert (proposal 2 doesn\'t exist)', async() => {
                await expectRevert.unspecified(VotingInstance.getOneProposal(BN(2), { from: _voter1 }));
            });

            it('should get winningProposalID', async() => {
                const winningProposalID = await VotingInstance.winningProposalID();
                expect(winningProposalID).to.be.bignumber.equal(BN(0));
            });
        });
    });

    context('\n✨ CONTEXT: Testing getters when WorkflowStatus == VotingSessionStarted\n', () => {
        beforeEach(async() => {
            // Add _voter1 as a Voter
            await VotingInstance.addVoter(_voter1, { from: _owner });
            // Start Proposals Registering
            await VotingInstance.startProposalsRegistering({ from: _owner });
            // Add a second proposal (Proposal[0] is set by startProposalsRegistering)
            await VotingInstance.addProposal('Proposition 1', { from: _voter1 });
            // End Proposals Registering
            await VotingInstance.endProposalsRegistering({ from: _owner });
            // Start Voting Session
            await VotingInstance.startVotingSession({ from: _owner});
            // _voter1 vote for Proposal[1]
            await VotingInstance.setVote(1, { from: _voter1});
        });

        describe('• Get voter', () => {
            it('should return Voter of the provided address', async() => {
                const receipt = await VotingInstance.getVoter(_voter1, { from: _voter1 });

                // _voter1 has voted for Proposal[1]
                expect(receipt.isRegistered).to.be.true;
                expect(receipt.hasVoted).to.be.true;
                expect(receipt.votedProposalId).to.be.bignumber.equal(BN(1));
            });           
        });

        describe('• Get one proposal', () => {
            it('should return Proposal of the id 0', async() => {
                const receipt = await VotingInstance.getOneProposal(BN(0), { from: _voter1 });
    
                expect(receipt.description, 'GENESIS');
                expect(receipt.voteCount, BN(0));
            });

            it('should return Proposal of the id 1', async() => {
                const receipt = await VotingInstance.getOneProposal(BN(1), { from: _voter1 });
    
                expect(receipt.description, 'Proposition 1');
                // _voter1 has voted for this proposal
                expect(receipt.voteCount, BN(1));
            });

            it('should revert (You\'re not a voter)', async() => {
                await expectRevert(
                    VotingInstance.getOneProposal(_voter1, { from: _owner }),
                    'You\'re not a voter'
                );
            });

            it('should revert (proposal 2 doesn\'t exist)', async() => {
                await expectRevert.unspecified(VotingInstance.getOneProposal(BN(2), { from: _voter1 }));
            });

            it('should get winningProposalID', async() => {
                const winningProposalID = await VotingInstance.winningProposalID();
                expect(winningProposalID).to.be.bignumber.equal(BN(0));
            });
        });
    });

    // ::::::::::::: REGISTRATION ::::::::::::: //

    context('\n✨ CONTEXT: Register a Voter\n', () => {
        describe('• Add voter', () => {
            it('should register a voter (sender is the owner)', async() => {
                const receipt = await VotingInstance.addVoter(_voter1, { from: _owner });    
                expectEvent(receipt, 'VoterRegistered', {voterAddress: _voter1});
            });
    
            it('should revert (Ownable: caller is not the owner)', async() => {
                await expectRevert(
                    VotingInstance.addVoter(_voter1, { from: _voter2 }),
                    'Ownable: caller is not the owner'
                );
            });
    
            it('should revert (Voters registration is not open yet)', async() => {
                // Owner start proposals registering
                await VotingInstance.startProposalsRegistering({ from: _owner });
    
                await expectRevert(
                    VotingInstance.addVoter(_voter1, { from: _owner }),
                    'Voters registration is not open yet'
                );
            })
    
            it('should revert (voter is Already registered)', async() => {
                // Register _voter1 as a voter
                const receipt = await VotingInstance.addVoter(_voter1, { from: _owner });
                expectEvent(receipt, 'VoterRegistered', { voterAddress: _voter1 });
    
                // Register again _voter1 as a voter
                await expectRevert(
                    VotingInstance.addVoter(_voter1, { from: _owner }),
                    'Already registered'
                );
            });
        });
    });

    // ::::::::::::: PROPOSAL ::::::::::::: //

    context('\n✨ CONTEXT: Register a Proposal\n', () => {
        describe('• Add proposal', () => {
            // Create a voter
            beforeEach(async() => {
                await VotingInstance.addVoter(_voter1, { from: _owner });
            });
    
            it('should add proposal if sender is a voter', async() => {
                // Start Proposals Registering
                await VotingInstance.startProposalsRegistering({ from: _owner });
    
                const receipt = await VotingInstance.addProposal("Proposition 1", { from: _voter1 });
                expectEvent(receipt, 'ProposalRegistered', { proposalId: BN(1) });
            });
    
            it('should revert (You\'re not a voter)', async() => {
                // Start Proposals Registering
                await VotingInstance.startProposalsRegistering({ from: _owner });
    
                await expectRevert(
                    VotingInstance.addProposal("Proposition 1", { from: _voter2 }),
                    'You\'re not a voter'
                );
            });
    
            it('should revert (Proposals are not allowed yet)', async() => {
                await expectRevert(
                    VotingInstance.addProposal("Proposition 1", { from: _voter1 }),
                    'Proposals are not allowed yet'
                );
            });
    
            it('should revert (Vous ne pouvez pas ne rien proposer)', async() => {
                // Start Proposals Registering
                await VotingInstance.startProposalsRegistering({ from: _owner });
    
                await expectRevert(
                    VotingInstance.addProposal("", { from: _voter1}),
                    'Vous ne pouvez pas ne rien proposer'
                );
            });
        });
    });

    // ::::::::::::: VOTE ::::::::::::: //

    context('\n✨ CONTEXT: Set a vote\n', () => {
        describe('• Set Vote', () => {
            beforeEach(async() => {
                // Create a voter
                await VotingInstance.addVoter(_voter1, { from: _owner });
                // Start Proposals Registering
                await VotingInstance.startProposalsRegistering({ from: _owner });
                // Create a proposal
                await VotingInstance.addProposal("Proposition 1", { from: _voter1 });
                // End Proposals Registering
                await VotingInstance.endProposalsRegistering({ from: _owner });
                // Start Voting Session
                await VotingInstance.startVotingSession({ from: _owner });
            });
    
            it('should vote for a proposal if sender is a voter', async() => {
                const receipt = await VotingInstance.setVote(BN(1), { from: _voter1 });
                expectEvent(receipt, 'Voted', { voter: _voter1, proposalId: BN(1) });
            });
    
            it('should revert (You\'re not a voter)', async() => {
                await expectRevert(
                    VotingInstance.setVote(BN(1), { from: _voter2 }),
                    'You\'re not a voter'
                );
            });
    
            it('should revert (Voting session haven\'t started yet)', async() => {
                await VotingInstance.endVotingSession({ from: _owner });
    
                await expectRevert(
                    VotingInstance.setVote(BN(1), { from: _voter1 }),
                    'Voting session havent started yet'
                );
            });
    
            it('should revert (You have already voted)', async() => {
                // _voter1 vote for the first time
                await VotingInstance.setVote(BN(1), { from: _voter1 });
    
                // _voter1 try to vote a second time
                await expectRevert(
                    VotingInstance.setVote(BN(1), { from: _voter1 }),
                    'You have already voted'
                );
            });
    
            it('should revert (Proposal not found)', async() => {
                await expectRevert(
                    VotingInstance.setVote(BN(2), { from: _voter1 }),
                    'Proposal not found'
                );
            });
        });
    });

    // ::::::::::::: STATE ::::::::::::: //

    context('\n✨ CONTEXT: Testing state\n', () => {
        describe('• Start Proposals Registering', () => {
            it('should update status to ProposalsRegistrationStarted', async() => {
                const receipt = await VotingInstance.startProposalsRegistering({ from: _owner});
                const previousStatus = BN(receipt.logs[0].args.previousStatus.words[0]);
                const newStatus = BN(receipt.logs[0].args.newStatus.words[0]);
    
                expectEvent(
                    receipt,
                    'WorkflowStatusChange',
                    {
                        previousStatus: previousStatus,
                        newStatus: newStatus
                    }
                );
            });
    
            it('should revert (Ownable: caller is not the owner)', async() => {
                await expectRevert(
                    VotingInstance.startProposalsRegistering({ from: _voter1 }),
                    'Ownable: caller is not the owner'
                );
            });
    
            it('should revert (Registering proposals cant be started now)', async() => {
                await VotingInstance.startProposalsRegistering({ from: _owner });
    
                // _owner try to start proposals registering a second time
                await expectRevert(
                    VotingInstance.startProposalsRegistering({ from: _owner }),
                    'Registering proposals cant be started now'
                );
            });
        });

        describe('• End Proposals Registering', () => {
            beforeEach(async() => {
                // Start Proposals Registering
                await VotingInstance.startProposalsRegistering({ from: _owner });
            });

            it('should update status to endProposalsRegistering', async() => {
                const receipt = await VotingInstance.endProposalsRegistering({ from: _owner});
                const previousStatus = BN(receipt.logs[0].args.previousStatus.words[0]);
                const newStatus = BN(receipt.logs[0].args.newStatus.words[0]);
                    
                expectEvent(
                    receipt,
                    'WorkflowStatusChange',
                    {
                        previousStatus: previousStatus,
                        newStatus: newStatus
                    }
                );
            });
    
            it('should revert (Ownable: caller is not the owner)', async() => {
                await expectRevert(
                    VotingInstance.endProposalsRegistering( { from: _voter1 }),
                    'Ownable: caller is not the owner'
                );
            });
    
            it('should revert (Registering proposals havent started yet)', async() => {
                await VotingInstance.endProposalsRegistering({ from: _owner });
    
                // _owner try to end proposals registering a second time
                await expectRevert(
                    VotingInstance.endProposalsRegistering({ from: _owner }),
                    'Registering proposals havent started yet'
                );
            });
        });

        describe('• Start Voting Session', () => {
            beforeEach(async() => {
                // Create a voter
                await VotingInstance.addVoter(_voter1, { from: _owner });
                // Start Proposals Registering
                await VotingInstance.startProposalsRegistering({ from: _owner });
                // Create a proposal
                await VotingInstance.addProposal("Proposition 1", { from: _voter1 });
                // End Proposals Registering
                await VotingInstance.endProposalsRegistering({ from: _owner });
            });

            it('should update status to startVotingSession', async() => {
                const receipt = await VotingInstance.startVotingSession({ from: _owner});
                const previousStatus = BN(receipt.logs[0].args.previousStatus.words[0]);
                const newStatus = BN(receipt.logs[0].args.newStatus.words[0]);
                    
                expectEvent(
                    receipt,
                    'WorkflowStatusChange',
                    {
                        previousStatus: previousStatus,
                        newStatus: newStatus
                    }
                );
            });
    
            it('should revert (Ownable: caller is not the owner)', async() => {
                await expectRevert(
                    VotingInstance.startVotingSession({ from: _voter1 }),
                    'Ownable: caller is not the owner'
                );
            });
    
            it('should revert (Registering proposals phase is not finished)', async() => {
                await VotingInstance.startVotingSession({ from: _owner });
    
                // _owner try to start voting session a second time
                await expectRevert(
                    VotingInstance.startVotingSession({ from: _owner }),
                    'Registering proposals phase is not finished'
                );
            });
        });

        describe('• End Voting Session', () => {
            beforeEach(async() => {
                // Create a voter
                await VotingInstance.addVoter(_voter1, { from: _owner });
                // Start Proposals Registering
                await VotingInstance.startProposalsRegistering({ from: _owner });
                // Create a proposal
                await VotingInstance.addProposal("Proposition 1", { from: _voter1 });
                // End Proposals Registering
                await VotingInstance.endProposalsRegistering({ from: _owner });
                // Start Voting Session
                await VotingInstance.startVotingSession({ from: _owner });
                // Vote for a proposal
                await VotingInstance.setVote(BN(1), { from: _voter1 });
            });

            it('should update status to endVotingSession', async() => {
                const receipt = await VotingInstance.endVotingSession({ from: _owner});
                const previousStatus = BN(receipt.logs[0].args.previousStatus.words[0]);
                const newStatus = BN(receipt.logs[0].args.newStatus.words[0]);
                    
                expectEvent(
                    receipt,
                    'WorkflowStatusChange',
                    {
                        previousStatus: previousStatus,
                        newStatus: newStatus
                    }
                );
            });
    
            it('should revert (Ownable: caller is not the owner)', async() => {
                await expectRevert(
                    VotingInstance.endVotingSession({ from: _voter1 }),
                    'Ownable: caller is not the owner'
                );
            });
    
            it('should revert (Voting session havent started yet)', async() => {
                await VotingInstance.endVotingSession({ from: _owner });
    
                // _owner try to end voting session a second time
                await expectRevert(
                    VotingInstance.endVotingSession({ from: _owner }),
                    'Voting session havent started yet'
                );
            });
        });

        describe('• Tally Votes', () => {
            beforeEach(async() => {
                // Create a voter
                await VotingInstance.addVoter(_voter1, { from: _owner });
                // Start Proposals Registering
                await VotingInstance.startProposalsRegistering({ from: _owner });
                // Create a proposal
                await VotingInstance.addProposal("Proposition 1", { from: _voter1 });
                // End Proposals Registering
                await VotingInstance.endProposalsRegistering({ from: _owner });
                // Start Voting Session
                await VotingInstance.startVotingSession({ from: _owner });
                // Vote for a proposal
                await VotingInstance.setVote(BN(1), { from: _voter1 });
                // End voting Sesssion
                await VotingInstance.endVotingSession({ from: _owner });
            });

            it('should update status to VotesTallied', async() => {
                const receipt = await VotingInstance.tallyVotes({ from: _owner});
                const previousStatus = BN(receipt.logs[0].args.previousStatus.words[0]);
                const newStatus = BN(receipt.logs[0].args.newStatus.words[0]);
                    
                expectEvent(
                    receipt,
                    'WorkflowStatusChange',
                    {
                        previousStatus: previousStatus,
                        newStatus: newStatus
                    }
                );
            });

            it('should update winningProposalID', async() => {
                await VotingInstance.tallyVotes({ from: _owner});
                const winningProposalID = await VotingInstance.winningProposalID();

                expect(winningProposalID).to.be.bignumber.equal(BN(1), "winningProposalId is not equal to proposal 1");
            });
    
            it('should revert (Ownable: caller is not the owner)', async() => {
                await expectRevert(
                    VotingInstance.tallyVotes( { from: _voter1 }),
                    'Ownable: caller is not the owner'
                );
            });
    
            it('should revert (Current status is not voting session ended)', async() => {
                await VotingInstance.tallyVotes({ from: _owner });
    
                // _owner try to tally votes a second time
                await expectRevert(
                    VotingInstance.tallyVotes({ from: _owner }),
                    'Current status is not voting session ended'
                );
            });
        });
    });
});