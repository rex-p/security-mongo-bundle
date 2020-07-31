import { SecurityService, PermissionService } from "@kaviar/security-bundle";
import { securityTestDefinitions } from "@kaviar/security-bundle/dist/__tests__/reusable";
import { createEcosystem } from "../ecosystem";

describe("SecurityService", () => {
  securityTestDefinitions.forEach(({ message, test }) => {
    it(message, async () => {
      const { container, teardown } = await createEcosystem();
      const service = container.get(SecurityService);

      await test(service);
      await teardown();
    });
  });
});
