# Projet - Système de vote #
## Projet #1 ##

Voting.sol est un smart contract permettant à une petite organisation d'établir un vote.

###**Le processus de vote :**###

1. L'administrateur du vote enregistre une liste blanche d'électeurs identifiés par leur adresse Ethereum.
2. L'administrateur du vote commence la session d'enregistrement de la proposition.
3. Les électeurs inscrits sont autorisés à enregistrer leurs propositions pendant que la session d'enregistrement est active.
4. L'administrateur de vote met fin à la session d'enregistrement des propositions.
5. L'administrateur du vote commence la session de vote.
6. Les électeurs inscrits votent pour leur proposition préférée.
7. L'administrateur du vote met fin à la session de vote.
8. L'administrateur du vote comptabilise les votes.
9. Tout le monde peut vérifier les derniers détails de la proposition gagnante.

###**Fonctionnalités supplémentaires :**###
- Gestion de l'égalité : en cas d'égalité, un nouveau vote est lancé avec les propositions à égalité ;
- Gestion des doublons de propositions : une même proposition ne peut être enregistrée qu'une seule fois grâce à la fonction `checkProposals(string memory _description)` ;
- Reset de session : l'administrateur peut lancer un reset complet d'une session grâce à la fonction `resetSession()` (ajout des électeurs, enregistrement des propositions, vote et comptage des voies) ;
- Reset de propositions : l'administrateur peut lancer un reset des propositions uniquement afin de lancer un second vote avec les mêmes électeurs grâce à la fonction `resetProposals()`.