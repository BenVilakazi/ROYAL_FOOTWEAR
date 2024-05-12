import { TransactionBaseService } from "@medusajs/medusa";
import OnboardingRepository from "../repositories/onboarding";
import { EntityManager, IsNull, Not } from "typeorm";
import { UpdateOnboardingStateInput } from "../types/onboarding";
import { OnboardingState } from "../models/onboarding"; // Remove the duplicate import statement

type InjectedDependencies = {
  manager: EntityManager;
  onboardingRepository: typeof OnboardingRepository;
};

class OnboardingService extends TransactionBaseService {
  protected onboardingRepository_: typeof OnboardingRepository;

  constructor({ onboardingRepository }: InjectedDependencies) {
    super(arguments[0]);

    this.onboardingRepository_ = onboardingRepository;
  }

  async retrieve(): Promise<OnboardingState | undefined> {
    const onboardingRepo = this.activeManager_.getRepository(OnboardingState);
  
    const status = await onboardingRepo.findOne({
      where: { id: Not(IsNull()) },
    });

    return status as OnboardingState;
  }

  async update(data: UpdateOnboardingStateInput): Promise<OnboardingState> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const onboardingRepo = this.activeManager_.getRepository(OnboardingState);

        const status = await this.retrieve();

        for (const [key, value] of Object.entries(data)) {
          status[key] = value;
        }

        return await this.onboardingRepository_.save(status);
      }
    );
  }
}

export default OnboardingService;
