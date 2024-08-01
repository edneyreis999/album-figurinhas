import {
  PaginationOutput,
  PaginationOutputMapper,
} from '../../../../shared/application/pagination-output';
import { IUseCase } from '../../../../shared/application/use-case.interface';
import { SortDirection } from '../../../../shared/domain/repository/search-params';
import {
  IUserRepository,
  UserFilter,
  UserSearchParams,
  UserSearchResult,
} from '../../../domain/user.repository';
import { UserOutputMapper, type UserOutput } from '../_user-shared/user-output';

export class ListUsersUseCase implements IUseCase<ListUsersInput, ListUsersOutput> {
  constructor(private userRepo: IUserRepository) {}

  async execute(input: ListUsersInput): Promise<ListUsersOutput> {
    const params = new UserSearchParams(input);
    const searchResult = await this.userRepo.search(params);
    return this.toOutput(searchResult);
  }

  private toOutput(searchResult: UserSearchResult): ListUsersOutput {
    const { items: _items } = searchResult;
    const items = _items.map(i => {
      return UserOutputMapper.toOutput(i);
    });
    return PaginationOutputMapper.toOutput(items, searchResult);
  }
}

export type ListUsersInput = {
  page?: number;
  per_page?: number;
  sort?: 'displayName' | 'createdAt' | null;
  sort_dir?: SortDirection | null;
  filter?: UserFilter | null;
};

export type ListUsersOutput = PaginationOutput<UserOutput>;
