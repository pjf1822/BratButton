import {
  FirestoreDataConverter,
  DocumentData,
  QueryDocumentSnapshot,
  SnapshotOptions,
  doc
} from 'firebase/firestore';
import { Group, User } from '../zustandStore';

// Define the User data converter
export const userConverter: FirestoreDataConverter<User> = {
  toFirestore(user: User): DocumentData {
    return {
      id: user.id,
      username: user.username
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot<DocumentData>,
    options: SnapshotOptions
  ): User {
    const data = snapshot.data(options) as User;
    return {
      id: data.id,
      username: data.username
    };
  }
};

export const groupConverter: FirestoreDataConverter<Group> = {
  toFirestore(group: Group): DocumentData {
    return {
      groupName: group.groupName,
      members: group.members.map((memberRef) => memberRef.id), // Store as user IDs
      dailyIndex: group.dailyIndex,
      lastUpdated: group.lastUpdated,
      votesYes: group.votesYes.map((voteRef) => voteRef.id) // Store as user IDs
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot<DocumentData>,
    options: SnapshotOptions
  ): Group {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      groupName: data.groupName,
      members: (data.members || []).map(
        (id: string) => doc(db, 'users', id).withConverter(userConverter) // Create references with converter
      ),
      dailyIndex: data.dailyIndex,
      lastUpdated: data.lastUpdated,
      votesYes: (data.votesYes || []).map(
        (id: string) => doc(db, 'users', id).withConverter(userConverter) // Create references with converter
      )
    };
  }
};
